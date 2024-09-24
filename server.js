// server.js
const express = require('express');
const request = require('request');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/api/payments', (req, res) => {
    const options = {
        url: 'https://api.razorpay.com/v1/payments/',
        method: 'GET',
        auth: {
            user: 'rzp_live_GVI8i7n3ye5KG1',
            pass: 'UOGrb49YGDYE8XxpuFt9jrvE',
        },
    };

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        } else {
            res.status(response.statusCode).send(error || body);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Proxy server running on http://localhost:3000');
});
