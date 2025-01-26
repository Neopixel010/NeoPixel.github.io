const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// IP-Adressen speichern
app.post('/log-ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();

    const entry = { ip, timestamp };
    fs.appendFileSync('ips.json', JSON.stringify(entry) + '\n');
    res.status(200).json({ message: 'IP gespeichert!', entry });
});

// Alle IP-Adressen abrufen
app.get('/get-ips', (req, res) => {
    if (!fs.existsSync('ips.json')) {
        return res.json([]);
    }
    const data = fs.readFileSync('ips.json', 'utf-8').trim();
    const entries = data.split('\n').map(line => JSON.parse(line));
    res.json(entries);
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
