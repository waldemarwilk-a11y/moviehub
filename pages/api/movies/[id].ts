// pages/api/movies/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import pool from "../../../lib/db";

type SessionUser = {
  id: string;
  role: string;
  email?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions)) as { user: SessionUser } | null;

  if (!session?.user) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  if (session.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Brak uprawnień administratora" });
  }

  const movieId = req.query.id;
  if (!movieId || Array.isArray(movieId) || isNaN(Number(movieId))) {
    return res.status(400).json({ error: "Niepoprawne ID filmu" });
  }

  // 🔹 EDYCJA FILMU
  if (req.method === "PUT") {
    try {
      const { title, description, year, genre } = req.body;

      if (!title || !description || !year || !genre) {
        return res.status(400).json({ error: "Brak danych" });
      }

      // ✅ OWASP: walidacja długości i zakresu
      if (title.length > 100)
        return res.status(400).json({ error: "Tytuł jest za długi (max 100 znaków)" });
      if (description.length > 1000)
        return res.status(400).json({ error: "Opis jest za długi (max 1000 znaków)" });
      if (genre.length > 50)
        return res.status(400).json({ error: "Gatunek jest za długi (max 50 znaków)" });
      if (year < 1800 || year > new Date().getFullYear() + 1)
        return res.status(400).json({ error: "Niepoprawny rok filmu" });

      const result = await pool.query(
        `UPDATE movies
         SET title = $1, description = $2, year = $3, genre = $4
         WHERE id = $5
         RETURNING *`,
        [title, description, year, genre, movieId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Film nie istnieje" });
      }

      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }

  // 🔹 USUWANIE FILMU
  if (req.method === "DELETE") {
    try {
      await pool.query("DELETE FROM movies WHERE id = $1", [movieId]);
      return res.status(200).json({ message: "Film usunięty" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }

  return res.status(405).json({ error: "Metoda niedozwolona" });
}
