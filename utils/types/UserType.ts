export type UserType =
  | {
      id: string;
      fullName: string;
      email: string;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
      image?: string | null | undefined | undefined;
    }
  | undefined;
