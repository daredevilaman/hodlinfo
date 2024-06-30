const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

// Fetch data from API and store in PostgreSQL
const fetchAndStoreData = async () => {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const tickers = response.data;
        const top10 = Object.values(tickers).slice(0, 10);

        const client = await pool.connect();
        await client.query('DELETE FROM tickers'); // Clear existing data

        top10.forEach(async (ticker) => {
            const { name, last, buy, sell, volume, base_unit } = ticker;
            await client.query('INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)', [name, last, buy, sell, volume, base_unit]);
        });

        client.release();
    } catch (error) {
        console.error(error);
    }
};

// Fetch data initially and every 5 minutes
fetchAndStoreData();
setInterval(fetchAndStoreData, 300000);

app.use(express.static('public'));

app.get('/api/tickers', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM tickers');
        res.json(result.rows);
        client.release();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
