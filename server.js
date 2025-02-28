const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const api = require('./src/server/api');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));
app.use('/api', api);

app.get('/ranking', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'puntaje.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});