import axios from 'axios';

export const getPatients = async () => {
  return [
    { id: "1", name: "John" },
    { id: "2", name: "Mary" },
  ];
};
// api.ts
export const getTasks = async (patientId: string) => {
  const tasks = [
    {
      id: "1",
      patientId: "1",
      title: "Check BP",
      status: "todo",
      role: "nurse",
    },
    {
      id: "2",
      patientId: "1",
      title: "Diet Plan",
      status: "in_progress",
      role: "dietician",
    },
    {
      id: "3",
      patientId: "2",
      title: "Counselling",
      status: "done",
      role: "social_worker",
    },
  ];

  return tasks.filter(t => t.patientId === patientId);
};
export const updateTask = async (id: string, data: any) => {
  const res = await axios.patch(`/tasks/${id}`, data);
  return res.data;
};