"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PublicUser } from "@/types/auth";

async function fetchMe(): Promise<PublicUser | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    staleTime: 60 * 1000,
  });

  const login = useMutation({
    mutationFn: async (payload: { identifier: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "로그인에 실패했습니다.");
      return data.user as PublicUser;
    },
    onSuccess: (loggedInUser) => {
      queryClient.setQueryData(["auth", "me"], loggedInUser);
    },
  });

  const signup = useMutation({
    mutationFn: async (payload: { username: string; email: string; password: string }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "회원가입에 실패했습니다.");
      return data.user as PublicUser;
    },
    onSuccess: (signedUpUser) => {
      queryClient.setQueryData(["auth", "me"], signedUpUser);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAdmin: user?.role === "admin",
    login,
    signup,
    logout,
  };
}
