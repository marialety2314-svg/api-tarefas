import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userName: string;
    role: "ADMIN" | "USER";
    flash: string | null;
  }
}
