type Task = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  role?: string;
};

export default function TaskColumn({
  title,
  tasks,
  onClick,
}: {
  title: string;
  tasks: Task[];
  onClick: (task: Task) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        width: "220px",
        minHeight: "150px",
        background: "#fafafa",
      }}
    >
      {/* ✅ TITLE */}
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>

      {/* ✅ EMPTY STATE */}
      {tasks.length === 0 ? (
        <p style={{ color: "gray" }}>No tasks</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => {
              console.log("CLICKED TASK:", task); // ✅ correct debug
              onClick(task);
            }}
            style={{
              padding: "8px",
              marginBottom: "8px",
              background:
                task.status === "todo"
                  ? "#ffecec"
                  : task.status === "in_progress"
                  ? "#fff6e5"
                  : "#eaffea",
              borderRadius: "6px",
              cursor: "pointer",
              border: "1px solid #ddd",
              transition: "0.2s",
            }}
          >
            <strong>{task.title}</strong>

            {/* ROLE */}
            {task.role && (
              <p style={{ fontSize: "12px", color: "gray" }}>
                {task.role}
              </p>
            )}

            {/* UX Hint */}
            <p style={{ fontSize: "10px", color: "#999" }}>
              Click to move →
            </p>
          </div>
        ))
      )}
    </div>
  );
}