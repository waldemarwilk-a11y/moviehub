const pool = require("./db");

async function test() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Połączenie OK:", res.rows);
    } catch (error) {
        console.error("Błąd połączenia:", error);
    } finally {
        await pool.end();
    }
}

test();
