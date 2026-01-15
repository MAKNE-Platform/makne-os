export type UserRole = "BRAND" | "CREATOR";

export type UserRoleSelectedEvent = {
  type: "USER_ROLE_SELECTED";
  payload: {
    userId: string;
    role: UserRole;
  };
  metadata: {
    occurredAt: string;
  };
};
