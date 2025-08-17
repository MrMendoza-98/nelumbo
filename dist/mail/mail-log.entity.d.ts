export declare enum MailStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed",
    DELIVERED = "delivered"
}
export declare enum MailType {
    GENERAL = "general",
    PARKING_NOTIFICATION = "parking_notification",
    REMINDER = "reminder",
    SYSTEM = "system"
}
export declare class MailLog {
    id: number;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
    status: MailStatus;
    type: MailType;
    error_message?: string;
    retry_count: number;
    sent_at?: Date;
    created_at: Date;
    updated_at: Date;
}
