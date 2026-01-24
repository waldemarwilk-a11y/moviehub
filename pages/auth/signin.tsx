// pages/auth/signin.tsx
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false, // 🔑 ręczny redirect
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Nieprawidłowy email lub hasło");
      return;
    }

    // ✅ poprawne logowanie → dashboard
    router.push("/movies");
  };

  return (
    <div style={{ padding: 50, maxWidth: 400 }}>
      <h1>Logowanie</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
          required
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <hr style={{ margin: "20px 0" }} />

      <p>
        Nie masz konta?{" "}
        <Link href="/auth/register">
          <strong>Zarejestruj się</strong>
        </Link>
      </p>
    </div>
  );
}
