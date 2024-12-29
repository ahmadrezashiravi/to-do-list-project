// src/app/ClientSessionWrapper.tsx
"use client"; // Mark this as a client-side component

import { SessionProvider } from "next-auth/react";

export default function ClientSessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
