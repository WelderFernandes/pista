import { triggerClassReminder } from "@/lib/novu/novu";

process.env.NOVU_SECRET_KEY = "dc7cba5b653e0da9b544434a0c5ccafd";
process.env.NOVU_API_URL = "https://api.novu.vexis.cloud";

async function main() {
  const mockSession = {
    id: "test-session-" + Date.now(),
    studentId: "student-test-1",
    studentName: "Bobbby",
    type: "Aula Prática (Cat. B)",
    date: "2026-07-14",
    time: "15:00",
    duration: "50",
    meetingPoint: "Autoescola Pista Centro",
    instructorName: "Carlos Eduardo",
    organizationId: "org-test-1",
  };

  const mockStudent = {
    id: "student-test-1",
    name: "Bobbby",
    phone: "5527988217570",
    email: "bobbby@example.com",
  };

  console.log("Enviando disparo de teste para o Novu...");
  const result = await triggerClassReminder(mockSession, mockStudent);
  console.log("Resposta do Novu:", result);
}

main().catch(console.error);
