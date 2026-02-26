import { Message } from "@/types/message";

const MESSAGES_KEY = "soapbox_messages";

export function getMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: Message[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function getApplicationMessages(applicationId: string): Message[] {
  return getMessages()
    .filter((m) => m.applicationId === applicationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addMessage(
  applicationId: string,
  senderId: string,
  senderName: string,
  senderType: "applicant" | "employer",
  content: string
): Message {
  const messages = getMessages();

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    applicationId,
    senderId,
    senderName,
    senderType,
    content,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  messages.push(newMessage);
  saveMessages(messages);

  return newMessage;
}

export function markMessagesAsRead(applicationId: string, userId: string): void {
  const messages = getMessages();
  const updated = messages.map((m) => {
    if (m.applicationId === applicationId && m.senderId !== userId && !m.isRead) {
      return { ...m, isRead: true };
    }
    return m;
  });
  saveMessages(updated);
}

export function getUnreadCount(applicationId: string, userId: string): number {
  return getMessages().filter(
    (m) => m.applicationId === applicationId && m.senderId !== userId && !m.isRead
  ).length;
}

export function hasUnreadMessages(userId: string, applicationIds: string[]): boolean {
  const messages = getMessages();
  return messages.some(
    (m) => applicationIds.includes(m.applicationId) && m.senderId !== userId && !m.isRead
  );
}
