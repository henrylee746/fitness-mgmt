import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  project: ["read", "create", "update"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  project: ["read", "create", "update"],
});

export const trainer = ac.newRole({
  project: ["read"],
});

export const admin = ac.newRole({
  project: ["read", "create", "update"],
});
