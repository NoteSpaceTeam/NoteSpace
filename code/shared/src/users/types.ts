export type UserData = {
  name: string;
  email: string;
};

export type User = UserData & {
  id: string;
  createdAt: string;
};

export type LoggedUser = UserData & {
  id: string;
};
