import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/providers/storeProvider";
import { ApolloWrapper } from "@/config/graphql/config";
export const metadata: Metadata = {
  title: "Gamification Module",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
        <ApolloWrapper >
          {children}
          </ApolloWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
