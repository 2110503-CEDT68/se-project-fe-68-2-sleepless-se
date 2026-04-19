"use client";

import { SessionProvider } from "next-auth/react";

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
  // ไม่ส่ง session prop เข้า SessionProvider
  // การส่ง initial session ใน App Router ทำให้ session หายเมื่อ refresh
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
