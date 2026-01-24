// pages/movies/add.tsx
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AddMovie() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(2023);
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <p>Ładowanie...</p>;
  if (!session || session.user.role !== "ADMIN") return <p>Nie masz uprawnień.</p>;

  const handleSubmit = async () => {
    if (!title || !description || !genre) {
      setMessage({ text: "Uzupełnij wszystkie pola", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, year, genre }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: `Dodano film: ${data.title}`, type: "success" });
        setTimeout(() => router.push("/movies"), 1200);
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Błąd sieciowy", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: 20,
      maxWidth: 600,
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h1 style={{ marginBottom: 20 }}>Dodaj film</h1>

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: 15,
            color: message.type === "error" ? "#b71c1c" : "#1b5e20",
            border: `1px solid ${message.type === "error" ? "#b71c1c" : "#1b5e20"}`,
            borderRadius: 6,
            background: message.type === "error" ? "#ffcdd2" : "#c8e6c9",
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#f9f9f9",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
      }}>
        <input
          placeholder="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
        />
        <textarea
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", width: "100%", minHeight: 80 }}
        />
        <input
          placeholder="Rok"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
        />
        <input
          placeholder="Gatunek"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            marginTop: 10,
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#111")}
        >
          {loading ? "Dodawanie..." : "Dodaj film"}
        </button>
      </div>
    </div>
  );
}
