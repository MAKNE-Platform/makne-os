import { UserRoleSelectedEvent } from "./events/UserRoleSelected";

export type UserReadModel = {
  id: string;
  role?: "BRAND" | "CREATOR";
};

export function applyUserEvent(
  state: UserReadModel,
  event: UserRoleSelectedEvent
): UserReadModel {
  switch (event.type) {
    case "USER_ROLE_SELECTED":
      return {
        ...state,
        role: event.payload.role,
      };

    default:
      return state;
  }
}
