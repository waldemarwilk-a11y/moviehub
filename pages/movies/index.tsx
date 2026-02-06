// pages/movies/index.tsx
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import pool from "../../lib/db";
import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  year: number;
};

type Props = {
  movies: Movie[];
  userRole: string | null;
};

export default function MoviesPage({ movies, userRole }: Props) {
  const isModerator = userRole === "MODERATOR";

  return (
    <div style={{
      padding: 20,
      maxWidth: 800,
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{ marginBottom: 20, textAlign: "center" }}>🎬 Lista filmów</h1>

      {isModerator && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Link href="/movies/add">
            <button style={{
              padding: "10px 20px",
              fontSize: 16,
              fontWeight: 600,
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              transition: "background 0.3s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#333")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#111")}>
              ➕ Dodaj film
            </button>
          </Link>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }}>
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#f9f9f9",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
            }}>
              <h2 style={{ margin: 0, marginBottom: 5, fontSize: 18, color: "#111" }}>{movie.title}</h2>
              <p style={{ margin: 0, color: "#555" }}>Rok: {movie.year}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const result = await pool.query("SELECT id, title, year FROM movies ORDER BY id ASC");

  const userRole = session.user?.role || null;

  return {
    props: {
      movies: result.rows,
      userRole,
    },
  };
};
