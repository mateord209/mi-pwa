import express from 'express';
import cors from 'cors';
import oracledb from 'oracledb';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT
};

async function run(sql, binds = {}) {
  const conn = await oracledb.getConnection(dbConfig);
  try {
    return await conn.execute(sql, binds, { autoCommit: true });
  } finally {
    await conn.close();
  }
}

app.get('/api/tareas', async (req, res) => {
  try {
    const r = await run('SELECT id AS "id", titulo AS "titulo", hecha AS "hecha" FROM tareas ORDER BY id DESC');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tareas', async (req, res) => {
  try {
    await run('INSERT INTO tareas (titulo) VALUES (:titulo)', { titulo: req.body.titulo });
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('API lista en http://localhost:3000'));
