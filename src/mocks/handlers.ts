import { http, HttpResponse } from "msw";

let patients = [
  { id: "1", name: "John" },
  { id: "2", name: "Mary" },
];

let tasks = [
  {
    id: "1",
    patientId: "1",
    title: "Check BP",
    status: "todo",
    role: "nurse",
  },
];

export const handlers = [
  http.get("*/patients", () => {
     console.log("MSW HIT /patients ✅");
     return HttpResponse.json([
    { id: "1", name: "John" },
    { id: "2", name: "Mary" },
  ]);
  }),

  http.get("*/patients/:id/tasks", ({ params }) => {
     console.log("MSW HIT /patients/:id/tasks ✅");
    return HttpResponse.json(
      tasks.filter(t => t.patientId === params.id)
    );
  }),
  http.patch("*/tasks/:id", async ({ params, request }) => {
  const { id } = params;
  const updates = await request.json() as Record<string, unknown>;

  tasks = tasks.map(task =>
    task.id === id ? { ...task, ...updates } : task
  );

  return HttpResponse.json({ success: true });
}),
];