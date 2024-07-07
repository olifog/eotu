import type { Metadata } from "next";
import "./globals.css";
import TrpcRoot from "@/components/TrpcRoot";
import React from "react";

export const metadata: Metadata = {
  title: "End Of The Universe",
  description: "End Of The Universe",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return React.createElement(TrpcRoot, {}, children);
}

export default RootLayout;
