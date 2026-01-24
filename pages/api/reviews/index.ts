// pages/api/reviews/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import pool from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  // 🔹 DODAWANIE RECENZJI
  if (req.method === "POST") {
    try {
      const { movie_id, rating, comment } = req.body;
      const user_id = session.user.id;

      // ✅ OWASP: walidacja inputów
      if (!movie_id || !rating || !comment) {
        return res.status(400).json({ error: "Brak danych" });
      }

      const movieIdNum = Number(movie_id);
      const ratingNum = Number(rating);

      if (isNaN(movieIdNum) || movieIdNum <= 0) {
        return res.status(400).json({ error: "Niepoprawne ID filmu" });
      }
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: "Ocena musi być liczbą od 1 do 5" });
      }
      if (typeof comment !== "string" || comment.length > 500) {
        return res.status(400).json({ error: "Komentarz jest za długi (max 500 znaków)" });
      }

      const result = await pool.query(
        "INSERT INTO reviews (user_id, movie_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
        [user_id, movieIdNum, ratingNum, comment]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }

  // 🔹 POBIERANIE WSZYSTKICH RECENZJI
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM reviews ORDER BY id ASC");
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }

  return res.status(405).json({ error: "Metoda niedozwolona" });
}
