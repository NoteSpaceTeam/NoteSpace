export type UserData = {
  id: string;
  name: string;
  email: string;
};

export type User = UserData & {
  createdAt: string;
};

export type Collaborator = UserData & {
  color: string;
};
