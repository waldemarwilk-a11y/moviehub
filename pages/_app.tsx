// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import AuthBar from "../components/AuthBar";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f0f2f5", // subtelne, lekkie tło
          minHeight: "100vh",
          color: "#1f2937",
        }}
      >
        <AuthBar />
        <main
          style={{
            maxWidth: 960,
            margin: "30px auto",
            padding: "0 20px",
            backgroundColor: "#fff",
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}
