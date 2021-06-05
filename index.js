const express = require('express');
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cors());
// app.listen(2000);


app.get('/', function(req, res){
    res.send('Hello world')
});

/*
  Servidor propriamente dito
*/

const notes = [
    {id: 0, username: "Guilherme", password : "guilherme", email: "gui@gmail.com"},
    {id: 1, username: "Eric", password : "ericaobrabo", email: "eric@gmail.com"},
]

const endpoint = "/notes";

app.get(endpoint, function(req, res){
    res.send(notes.filter(Boolean));
    // res.send(notes);
});

app.get(`${endpoint}/:id`, function(req, res){
    const id = req.params.id;
    const note = notes[id];

    if (!note){
        res.send("{}");
    } else {
        res.send(note);
    }   
});

app.post(endpoint, (req, res) => {
    const note = {
        id : notes.length,
        username : req.body["username"],
        password : req.body["password"],
        email : req.body["email"]
    };
    notes.push(note);
    res.send("1");

    notify();
});

app.put(`${endpoint}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const note = {
        id : id,
        username : req.body["username"],
        password : req.body["password"],
        email : req.body["email"]
    };

    notes[id] = note;
    res.send("1");

    notify();
});

app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete notes[id];
    res.send("1");

    // Notificar todos
    notify();
});


/*
  Criar um socket para notificar usuários das mudanças.
*/

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Comunicação
const INVALIDATE = 'invalidate';

function notify(){
    io.sockets.emit(INVALIDATE, 1);
}

server.listen(process.env.PORT);