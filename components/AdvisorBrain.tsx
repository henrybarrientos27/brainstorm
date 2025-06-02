"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import AppHome from "./AppHome"; // your main UI logic

export default function AdvisorBrainWrapper() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") return <div>Checking auth...</div>;
  return <AppHome session={session} />;
}
