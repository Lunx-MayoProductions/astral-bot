import express from 'express'
import { getDb } from '../util/database';
import { verified, warns } from '../util/tables';
import { eq, or } from 'drizzle-orm';

const port = 6800;

const app = express()

app.get('/ping', (req, res) => {
  res.contentType('application/json');
    res.write(JSON.stringify({
    message: 'Pong!',
    timestamp: new Date().toISOString()
  }));
  res.end();
});

app.get('/', async (req, res) => {
    res.contentType('text/html');
  res.write(`<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
}
h1 {
  color: #4CAF50;
}
  </style>
  `);
  res.write('<h1>Welcome to the Astral API</h1>');
  res.write('<p>Use the <a href="/warn?user=<user_id>">/warn</a> POST endpoint to warn a user.</p>');
  res.write('<p>Use the <a href="/warn?user=<user_id>">/warn</a> GET endpoint to get the warns of a user.</p>');
  res.write('<p>Use the <a href="/ping">/ping</a> endpoint to check if the server is running.</p>');
  res.write('<p>Use the <a href="/verify?user=<your_user_id>">/verify</a> endpoint to verify urself!.</p>');
  res.end();

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
});


app.get('/verify', async (req, res) => {
    const user:string = req.query.user as string;
    const db = await getDb();
    const existing = await db
    .select()
        .from(verified)
        .where(
            or(
                eq(verified.userid, parseInt(user)),
                eq(verified.ip, req.headers['x-forwarded-for'] as string),
                eq(verified.ip, req.socket.remoteAddress as string)
            )
        )
        .limit(1);

    if (existing.length > 0) {
        res.contentType('application/json');
        res.write(JSON.stringify({
            message: `User ${user} is already verified.`,
            verified: true
        }));
        res.end();
        return;
    }
    await db.insert(verified).values({
        userid: parseInt(user),
        ip: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string
    });
    res.contentType('application/json');
    res.write(JSON.stringify({
        message: `User ${user} has been verified successfully.`,
        verified: true
    }));
    res.end();
});



app.post('/warn', async (req, res) => {
    const user:string = req.query.user as string;
    const db = await getDb();
    const existing = await db
    .select()
        .from(warns)
        .where(eq(warns.userid, parseInt(user)))
        .limit(1);
    
      if (existing.length > 0) {
        await db
          .update(warns)
          .set({ warns: existing[0].warns + 1 })
          .where(eq(warns.userid, parseInt(user)));
      } else {
        await db.insert(warns).values({
          userid: parseInt(user),
          warns: 1
        });
      }

      res.contentType('application/json');
      res.write(JSON.stringify({
        message: `User ${user} has been warned successfully.`,
        warns: existing.length > 0 ? existing[0].warns + 1 : 1
      }));
      res.end();
});


app.get('/warn', async (req, res) => {
    const user:string = req.query.user as string;
    const db = await getDb();
    const existing = await db
    .select()
        .from(warns)
        .where(eq(warns.userid, parseInt(user)))
        .limit(1);
    
      if (existing.length > 0) {
        res.contentType('application/json');
        res.write(JSON.stringify({
          warns: existing[0].warns
        }));
      } else {
        res.contentType('application/json');
        res.write(JSON.stringify({
          warns: 0
        }));
      }
      res.end();
});

export default app;
export const hostname = 'localhost';
export const apiUrl = `http://${hostname}:${port}`;