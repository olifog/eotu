"use client";
import { Inter } from "next/font/google";
import { trpc } from "@/lib/trpc";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });
function TrpcRoot({
  children,
}: PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

export default trpc.withTRPC(TrpcRoot);

