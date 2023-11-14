import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

app.post('/hello', (req, res) => {
    res.send('You just called the post method at "/hello"!\n');
});

app.listen(8000, () => {
    console.log('Listening on port 8000');
    });