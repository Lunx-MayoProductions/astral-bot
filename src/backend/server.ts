import express from 'express'
import { eq, or } from 'drizzle-orm';

const port = 6800;

const app = express()

app.get('/ping', (req, res) => {
});

app.get('/', async (req, res) => {
});


app.get('/verify', async (req, res) => {

});



app.post('/warn', async (req, res) => {

});


app.get('/warn', async (req, res) => {

});

export default app;
export const hostname = 'localhost';
export const apiUrl = `http://${hostname}:${port}`;