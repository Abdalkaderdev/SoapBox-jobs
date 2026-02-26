export interface Message {
  id: string;
  applicationId: string;
  senderId: string;
  senderName: string;
  senderType: "applicant" | "employer";
  content: string;
  createdAt: string;
  isRead: boolean;
}
