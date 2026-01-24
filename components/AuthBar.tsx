// components/AuthBar.tsx
import { signOut, useSession } from "next-auth/react";

export default function AuthBar() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <header
      style={{
        padding: "14px 24px",
        background: "#1e293b", // ciemny granat
        color: "#f9fafb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        borderRadius: "0 0 12px 12px",
      }}
    >
      {session?.user ? (
        <>
          <span style={{ fontSize: 15 }}>
            Zalogowany jako: <strong>{session.user.email}</strong>{" "}
            <em>({session.user.role})</em>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            style={{
              padding: "6px 16px",
              cursor: "pointer",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#6366f1")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#4f46e5")
            }
          >
            Wyloguj
          </button>
        </>
      ) : (
        <span style={{ fontSize: 15 }}>Nie jesteś zalogowany</span>
      )}
    </header>
  );
}
