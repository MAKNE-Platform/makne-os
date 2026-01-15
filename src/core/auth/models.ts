export type UserRole = "BRAND" | "CREATOR";

export interface User {
  _id: string;
  email?: string;
  role?: UserRole;     
  isTemporary: boolean;
  createdAt: Date;
}


export interface OtpToken {
  userId: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}


export interface Session {
  _id: string; // sessionId (UUID)
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}
