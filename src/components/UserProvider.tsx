"use client";

import { createContext, useContext } from "react";

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
} | null;

const UserContext = createContext<{ user: User; isLoading: boolean }>({
  user: null,
  isLoading: true,
});

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User;
}) {
  return (
    <UserContext.Provider value={{ user: initialUser, isLoading: false }}>
      {children}
    </UserContext.Provider>
  );
}