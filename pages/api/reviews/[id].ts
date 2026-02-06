// pages/api/reviews/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import pool from "../../../lib/db";

type SessionUser = {
  id: string;
  role: string;
  email?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  const reviewIdParam = req.query.id;

  // ✅ OWASP: walidacja ID
  if (!reviewIdParam || Array.isArray(reviewIdParam)) {
    return res.status(400).json({ error: "Niepoprawne ID recenzji" });
  }

  const reviewId = Number(reviewIdParam);
  if (isNaN(reviewId) || reviewId <= 0) {
    return res.status(400).json({ error: "Niepoprawne ID recenzji" });
  }

  try {
    const result = await pool.query(
      "SELECT user_id FROM reviews WHERE id = $1",
      [reviewId]
    );
    const review = result.rows[0];

    if (!review) {
      return res.status(404).json({ error: "Recenzja nie istnieje" });
    }

    const user = session.user as SessionUser;

    // 🗑 DELETE
    if (req.method === "DELETE") {
      if (user.role !== "MODERATOR" && user.id !== review.user_id.toString()) {
        return res.status(403).json({ error: "Brak uprawnień" });
      }

      await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
      return res.status(200).json({ message: "Recenzja usunięta" });
    }

    // ✏️ PUT
    if (req.method === "PUT") {
      const { rating, comment } = req.body;

      // ✅ OWASP: walidacja danych wejściowych
      if (rating == null || comment == null) {
        return res.status(400).json({ error: "Brak danych" });
      }

      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: "Ocena musi być liczbą od 1 do 5" });
      }

      if (typeof comment !== "string" || comment.length > 500) {
        return res.status(400).json({ error: "Komentarz jest za długi (max 500 znaków)" });
      }

      if (user.role !== "MODERATOR" && user.id !== review.user_id.toString()) {
        return res.status(403).json({ error: "Brak uprawnień" });
      }

      const updated = await pool.query(
        "UPDATE reviews SET rating=$1, comment=$2 WHERE id=$3 RETURNING *",
        [ratingNum, comment, reviewId]
      );

      return res.status(200).json(updated.rows[0]);
    }

    return res.status(405).json({ error: "Metoda niedozwolona" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Błąd serwera" });
  }
}
