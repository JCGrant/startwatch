import type { Session, User } from '$lib/server/db/schema';

declare global {
  namespace App {
    interface Locals {
      user: User;
      session: Session;
    }
  }
}

export {};
