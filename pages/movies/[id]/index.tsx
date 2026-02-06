// pages/movies/[id]/index.tsx
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import pool from "../../../lib/db";
import { useState } from "react";

type Review = {
  id: number;
  user_id: number;
  user_email: string; // email autora
  rating: number;
  comment: string;
  created_at: string;
};

type Movie = {
  id: number;
  title: string;
  description: string;
  year: number;
  genre: string;
  created_at: string;
};

type SessionUser = {
  id: string;
  email: string;
  role: string;
};

type Props = {
  movie: Movie;
  reviews: Review[];
  averageRating: number | null;
};

export default function MovieDetails({
  movie,
  reviews: initialReviews,
  averageRating,
}: Props) {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;

  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [avgRating, setAvgRating] = useState(averageRating);
  const [loading, setLoading] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  const [isEditingMovie, setIsEditingMovie] = useState(false);
  const [editTitle, setEditTitle] = useState(movie.title);
  const [editDescription, setEditDescription] = useState(movie.description);
  const [editYear, setEditYear] = useState(movie.year);
  const [editGenre, setEditGenre] = useState(movie.genre);

  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  // ================= RECENZJE =================
  const handleAddReview = async () => {
    if (!user) return setMessage({ text: "Musisz być zalogowany", type: "error" });

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ movie_id: movie.id, rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        const newReviews = [...reviews, data];
        setReviews(newReviews);
        setComment("");
        setRating(5);
        setAvgRating(newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length);
        setMessage({ text: "Recenzja dodana", type: "success" });
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch {
      setMessage({ text: "Błąd sieciowy", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!user) return;
    if (!confirm("Usunąć recenzję?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        const newReviews = reviews.filter((r) => r.id !== id);
        setReviews(newReviews);
        setAvgRating(newReviews.length ? newReviews.reduce((a, r) => a + r.rating, 0) / newReviews.length : null);
        setMessage({ text: "Recenzja usunięta", type: "success" });
      } else setMessage({ text: data.error, type: "error" });
    } catch {
      setMessage({ text: "Błąd sieciowy", type: "error" });
    }
  };

  const handleSaveEdit = async () => {
    if (!user || editingReviewId === null) return;

    try {
      const res = await fetch(`/api/reviews/${editingReviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: editRating, comment: editComment }),
      });
      const data = await res.json();
      if (res.ok) {
        const newReviews = reviews.map((r) => (r.id === editingReviewId ? data : r));
        setReviews(newReviews);
        setAvgRating(newReviews.reduce((a, r) => a + r.rating, 0) / newReviews.length);
        setEditingReviewId(null);
        setMessage({ text: "Recenzja zaktualizowana", type: "success" });
      } else setMessage({ text: data.error, type: "error" });
    } catch {
      setMessage({ text: "Błąd sieciowy", type: "error" });
    }
  };

  // ================= FILM (MODERATOR) =================
  const handleSaveMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${movie.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: editTitle, description: editDescription, year: editYear, genre: editGenre }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Film zaktualizowany", type: "success" });
        location.reload();
      } else setMessage({ text: data.error, type: "error" });
    } catch {
      setMessage({ text: "Błąd sieciowy", type: "error" });
    }
  };

  const handleDeleteMovie = async () => {
    if (!confirm("USUNĄĆ FILM NA STAŁE?")) return;

    try {
      const res = await fetch(`/api/movies/${movie.id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) window.location.href = "/movies";
      else setMessage({ text: "Nie udało się usunąć filmu", type: "error" });
    } catch {
      setMessage({ text: "Błąd sieciowy", type: "error" });
    }
  };

  // ================= RENDER =================
  return (
    <div style={{ padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1>{movie.title}</h1>

      {avgRating !== null && (
        <p style={{ fontSize: 16, fontWeight: 500 }}>
          Średnia ocena: <strong>{avgRating.toFixed(1)}</strong> / 5
        </p>
      )}

      {message && (
        <div style={{ padding: 10, marginBottom: 15, color: message.type === "error" ? "red" : "green", border: `1px solid ${message.type === "error" ? "red" : "green"}`, borderRadius: 4 }}>
          {message.text}
        </div>
      )}

      {user?.role === "MODERATOR" && (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setIsEditingMovie(true)} style={{ marginRight: 8 }}>Edytuj film</button>
          <button onClick={handleDeleteMovie}>Usuń film</button>
        </div>
      )}

      {isEditingMovie && (
        <div style={{ marginBottom: 20, padding: 10, border: "1px solid #ddd", borderRadius: 6, background: "#f9f9f9" }}>
          <h3>Edycja filmu</h3>
          <input style={{ width: "100%", marginBottom: 5 }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Tytuł" />
          <textarea style={{ width: "100%", marginBottom: 5 }} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Opis" />
          <input style={{ width: "100%", marginBottom: 5 }} type="number" value={editYear} onChange={(e) => setEditYear(Number(e.target.value))} placeholder="Rok" />
          <input style={{ width: "100%", marginBottom: 5 }} value={editGenre} onChange={(e) => setEditGenre(e.target.value)} placeholder="Gatunek" />
          <button onClick={handleSaveMovie} style={{ marginRight: 5 }}>Zapisz</button>
          <button onClick={() => setIsEditingMovie(false)}>Anuluj</button>
        </div>
      )}

      <p><strong>Opis:</strong> {movie.description}</p>
      <p><strong>Rok:</strong> {movie.year}</p>
      <p><strong>Gatunek:</strong> {movie.genre}</p>

      <hr style={{ margin: "20px 0" }} />

      <h2>Opinie</h2>

      {reviews.length === 0 ? (
        <p>Brak opinii</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} style={{ padding: 10, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6, background: "#fdfdfd" }}>
            <b>{r.rating}/5</b> – {r.comment}
            <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
              Autor: {r.user_email} ({new Date(r.created_at).toLocaleString()})
            </div>
            {user && (user.role === "MODERATOR" || user.id === r.user_id.toString()) && (
              <div style={{ marginTop: 5 }}>
                <button onClick={() => { setEditingReviewId(r.id); setEditRating(r.rating); setEditComment(r.comment); }} style={{ marginRight: 5 }}>Edytuj</button>
                <button onClick={() => handleDeleteReview(r.id)}>Usuń</button>
              </div>
            )}
          </div>
        ))
      )}
      {user && editingReviewId !== null && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid #aaa",
            borderRadius: 6,
            background: "#fffbe6",
          }}
        >
          <h3>Edytuj opinię</h3>

          <label>
            Ocena:{" "}
            <select
              value={editRating}
              onChange={(e) => setEditRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <br />

          <textarea
            style={{ width: "100%", marginTop: 5, marginBottom: 5 }}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            placeholder="Edytuj komentarz"
          />

          <br />

          <button onClick={handleSaveEdit} style={{ marginRight: 5 }}>
            Zapisz zmiany
          </button>

          <button onClick={() => setEditingReviewId(null)}>
            Anuluj
          </button>
        </div>
      )}

      {user && editingReviewId === null && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ddd", borderRadius: 6, background: "#f9f9f9" }}>
          <h3>Dodaj opinię</h3>
          <label>
            Ocena:{" "}
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <br />
          <textarea style={{ width: "100%", marginTop: 5, marginBottom: 5 }} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Twój komentarz" />
          <br />
          <button onClick={handleAddReview} disabled={loading}>
            {loading ? "Dodawanie..." : "Dodaj opinię"}
          </button>
        </div>
      )}
    </div>
  );
}

// ================= SSR =================
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) return { redirect: { destination: "/auth/signin", permanent: false } };

  const id = ctx.params?.id;
  if (!id || Array.isArray(id)) return { notFound: true };

  const movieRes = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
  const movie = movieRes.rows[0];
  if (!movie) return { redirect: { destination: "/movies", permanent: false } };

  const reviewsRes = await pool.query(
    `SELECT r.*, u.email AS user_email
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE movie_id = $1
     ORDER BY r.created_at ASC`,
    [id]
  );

  movie.created_at = movie.created_at.toISOString();

  const reviews = reviewsRes.rows.map((r: any) => ({ ...r, created_at: r.created_at.toISOString() }));

  const averageRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;

  return { props: { movie, reviews, averageRating } };
};
