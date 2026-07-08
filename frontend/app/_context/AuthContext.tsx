"use client";

import { createContext, useContext, useState } from "react";
import { YetiTrekUser } from "@/lib/api/auth";

type AuthContextValue = {
  user: YetiTrekUser;
  setUser: (user: YetiTrekUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: YetiTrekUser;
}) {
  const [user, setUser] = useState(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
