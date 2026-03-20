import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTask } from "../api/api";
import TaskColumn from "./TaskColumn";
import type { Task, Patient } from "../types";

export default function PatientRow({
  patient,
  roleFilter,
}: {
  patient: Patient;
  roleFilter: string;
}) {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", patient.id],
    queryFn: () => getTasks(patient.id) as Promise<Task[]>,
  });

  // 🔥 OPTIMISTIC UPDATE
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task["status"] }) =>
      updateTask(id, { status }),

    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", patient.id] });

      const previousTasks = queryClient.getQueryData<Task[]>([
        "tasks",
        patient.id,
      ]);

      queryClient.setQueryData<Task[]>(
        ["tasks", patient.id],
        (old = []) =>
          old.map(task =>
            task.id === updatedTask.id
              ? { ...task, status: updatedTask.status }
              : task
          )
      );

      return { previousTasks };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", patient.id],
          context.previousTasks
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", patient.id] });
    },
  });

  // ✅ MOVE TASK
  const moveTask = (task: Task) => {
  let newStatus: Task["status"] = "todo";

  if (task.status === "todo") newStatus = "in_progress";
  else if (task.status === "in_progress") newStatus = "done";
  else if (task.status === "done") newStatus = "todo"; // 🔥 loop back

  mutation.mutate({
    id: task.id,
    status: newStatus,
  });
};

  // 🔥 APPLY ROLE FILTER
  const filteredTasks = roleFilter
    ? tasks.filter(t => t.role === roleFilter)
    : tasks;

  // ✅ FILTER INTO COLUMNS
  const todo = filteredTasks.filter(t => t.status === "todo");
  const inProgress = filteredTasks.filter(t => t.status === "in_progress");
  const done = filteredTasks.filter(t => t.status === "done");

  // ✅ UI
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>{patient.name}</h2>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          <TaskColumn title="Todo" tasks={todo} onClick={moveTask} />
          <TaskColumn title="In Progress" tasks={inProgress} onClick={moveTask} />
          <TaskColumn title="Done" tasks={done} onClick={moveTask} />
        </div>
      )}
    </div>
  );
}