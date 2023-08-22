const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.use(express.json());

async function fetch_url_data(url) {
    try {
        const response = await axios.get(url, { timeout: 500 });
        if (response.status === 200 && Array.isArray(response.data.numbers)) {
            return response.data.numbers;
        }
    } catch (error) {
        // Timeouts and other request errors ignored
    }

    return null;
}

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls) {
        return res.status(400).json({ error: 'NO URL provided' });
    }

    const urlsArray = Array.isArray(urls) ? urls : [urls];
    const validResponses = [];

    const fetchPromises = urlsArray.map(async (url) => {
        const numbers = await fetch_url_data(url);
        if (numbers) {
            validResponses.push(...numbers);
        }
    });

    await Promise.all(fetchPromises);

    //Removing duplicate integers and sorting the list
    const uniqueNumbers = Array.from(new Set(validResponses)).sort((a, b) => a - b);

    res.json({ "numbers": uniqueNumbers });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
