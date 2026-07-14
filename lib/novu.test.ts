import { describe, it, expect, vi, beforeEach } from "vitest";

const mockTrigger = vi.fn().mockResolvedValue({ transactionId: "mock-tx-id" });
const mockCancel = vi.fn().mockResolvedValue({ success: true });
const mockSubscribersCreate = vi.fn().mockResolvedValue({ success: true });

vi.mock("@novu/api", () => {
  class MockNovu {
    trigger = mockTrigger;
    cancel = mockCancel;
    subscribers = {
      create: mockSubscribersCreate,
    };
  }
  return {
    Novu: MockNovu,
  };
});

// Define the environment variable before importing to ensure client instantiation
process.env.NOVU_SECRET_KEY = "test-secret-key";

import { triggerClassReminder, cancelClassReminder, getNovuClient, triggerWelcomeNotification, triggerInviteNotification, triggerClassCancellationNotification, triggerClassConfirmationNotification, upsertNovuSubscriber } from "./novu/novu";

describe("Novu Integration Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger welcome notification with correct payload", async () => {
    const user = {
      id: "user-1",
      name: "Alice",
      email: "alice@example.com"
    };

    await triggerWelcomeNotification(user);

    expect(mockTrigger).toHaveBeenCalledWith({
      workflowId: "bem-vindo",
      to: {
        subscriberId: "user-1",
        firstName: "Alice",
        email: "alice@example.com",
      },
      payload: {
        name: "Alice",
        email: "alice@example.com",
      },
    });
  });

  it("should trigger invite notification with correct payload", async () => {
    const inviteData = {
      email: "invitee@example.com",
      inviterName: "Bob the Owner",
      orgName: "Pista Autoescola",
      inviteUrl: "http://localhost:3000/accept-invitation?id=123"
    };

    await triggerInviteNotification(inviteData);

    expect(mockTrigger).toHaveBeenCalledWith({
      workflowId: "convite-membro",
      to: {
        subscriberId: "invitee@example.com",
        email: "invitee@example.com",
      },
      payload: {
        inviterName: "Bob the Owner",
        orgName: "Pista Autoescola",
        inviteUrl: "http://localhost:3000/accept-invitation?id=123",
      },
    });
  });

  it("should trigger class confirmation notification with correct payload", async () => {
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
      email: "bob@example.com"
    };

    await triggerClassConfirmationNotification(session, student);

    expect(mockTrigger).toHaveBeenCalledWith({
      workflowId: "aula-confirmada",
      to: {
        subscriberId: "student-1",
        firstName: "Bob",
        phone: "+5527988217570",
        email: "bob@example.com",
      },
      payload: {
        studentName: "Bob",
        classSubject: "Carro B",
        classDate: "15/07/2026",
        classTime: "14:00",
        instructorName: "Instructor Name",
        meetingPoint: "Ponto de Encontro",
      },
    });
  });

  it("should trigger class cancellation notification with correct payload", async () => {
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
      email: "bob@example.com"
    };

    await triggerClassCancellationNotification(session, student);

    expect(mockTrigger).toHaveBeenCalledWith({
      workflowId: "aula-cancelada",
      to: {
        subscriberId: "student-1",
        firstName: "Bob",
        phone: "+5527988217570",
        email: "bob@example.com",
      },
      payload: {
        studentName: "Bob",
        classSubject: "Carro B",
        classDate: "15/07/2026",
        classTime: "14:00",
        instructorName: "Instructor Name",
        meetingPoint: "Ponto de Encontro",
      },
    });
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
      email: "bob@example.com"
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
        email: "bob@example.com"
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
      email: "bob@example.com"
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

  it("should create/update subscriber with correct payload", async () => {
    const user = {
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      phone: "5527988217570"
    };

    await upsertNovuSubscriber(user);

    expect(mockSubscribersCreate).toHaveBeenCalledWith({
      subscriberId: "user-1",
      email: "alice@example.com",
      firstName: "Alice",
      phone: "+5527988217570",
    });
  });

  it("should cancel class reminder event correctly", async () => {
    await cancelClassReminder("session-1");

    const client = getNovuClient();
    expect(client).toBeDefined();
    expect(mockCancel).toHaveBeenCalledWith("session_session-1");
  });
});
