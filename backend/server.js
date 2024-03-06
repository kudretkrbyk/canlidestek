let customerList = [];

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use((req, res, next) => {
    console.log('middleware');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

io.on('connection', (socket) => {
    socket.on('message', async (data) => {
        const messages = [
            { x: 'merhaba', y: 'merhaba! hoşgeldin.' },
            { x: 'nasılsın', y: 'iyiyim, teşekkür ederim. size nasıl yardımcı olabilirim?' },
            { x: 'adın ne', y: 'aris888' },
        ]

        const answer = messages.find((message) => message.x === data.message);
        if (answer) {
            socket.emit('message', { id: socket.id, date: Date.now(), message: answer.y });
        } else {
            const createAnswer = await getAnswer(data.message)
            if (createAnswer.message === 'OK')
                return socket.emit('message', { id: socket.id, date: Date.now(), message: createAnswer.data });

            socket.emit('message', { id: socket.id, date: Date.now(), message: 'I do not understand' });
        }
    });

    socket.on('request', async (data) => {
        if (data?.message === 'temsilci') {
            customerList.push(socket.id);
            console.log('customerList', customerList);
        }
    })
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

server.listen(3005, () => {
    console.log('listening on http://localhost:3005');
});

async function getAnswer(message) {
    const data = await fetch('https://aris888.io/api/ai/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: '9a78f4b-1d5b8d48*b6ac5f86a-*0f9-f5f44f85*0e', message: message })
    }).then(response => response.json());

    return data;
}   