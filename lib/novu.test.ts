import { describe, it, expect, vi, beforeEach } from "vitest";

// Define mock functions (must start with "mock")
const mockTrigger = vi.fn().mockResolvedValue({ transactionId: "mock-tx-id" });
const mockCancel = vi.fn().mockResolvedValue({ success: true });

vi.mock("@novu/api", () => {
  class MockNovu {
    trigger = mockTrigger;
    cancel = mockCancel;
  }
  return {
    Novu: MockNovu,
  };
});

// Define the environment variable before importing to ensure client instantiation
process.env.NOVU_SECRET_KEY = "test-secret-key";

import { triggerClassReminder, cancelClassReminder, getNovuClient } from "./novu";

describe("Novu Integration Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger class reminder event with correct payload", async () => {
    const session = {
      id: "session-1",
      studentId: "student-1",
      studentName: "Bob",
      type: "Carro B",
      date: "2026-07-15",
      time: "14:00",
      duration: "50",
      meetingPoint: "Ponto de Encontro",
      instructorName: "Instructor Name",
      organizationId: "org-1",
    };

    const student = {
      id: "student-1",
      name: "Bob",
      phone: "5527988217570",
      email: process.env.NOVU_TESTE_EMAIL
    };

    await triggerClassReminder(session, student);

    const client = getNovuClient();
    expect(client).toBeDefined();
    expect(mockTrigger).toHaveBeenCalledWith({
      workflowId: "lembrete-aula-agendada",
      to: {
        subscriberId: "student-1",
        firstName: "Bob",
        phone: "+5527988217570",
        email: process.env.NOVU_TESTE_EMAIL
      },
      payload: {
        studentName: "Bob",
        classSubject: "Carro B",
        classDate: "15/07/2026",
        classTime: "14:00",
        instructorName: "Instructor Name",
        meetingPoint: "Ponto de Encontro",
        duration: "50",
        classStartDateTime: new Date("2026-07-15T14:00:00").toISOString(),
      },
      transactionId: "session_session-1",
    });
  });

  it("should sanitize phone and add 55 DDI if not present", async () => {
    const session = {
      id: "session-1",
      studentId: "student-1",
      studentName: "Bob",
      type: "Carro B",
      date: "2026-07-15",
      time: "14:00",
      duration: "50",
      meetingPoint: "Ponto de Encontro",
      instructorName: "Instructor Name",
      organizationId: "org-1",
    };

    const student = {
      id: "student-1",
      name: "Bob",
      phone: "(27) 98821-7570",
      email: process.env.NOVU_TESTE_EMAIL
    };

    await triggerClassReminder(session, student);

    expect(mockTrigger).toHaveBeenCalledWith(
      expect.objectContaining({
        to: expect.objectContaining({
          phone: "+5527988217570",
        }),
      })
    );
  });

  it("should cancel class reminder event correctly", async () => {
    await cancelClassReminder("session-1");

    const client = getNovuClient();
    expect(client).toBeDefined();
    expect(mockCancel).toHaveBeenCalledWith("session_session-1");
  });
});
