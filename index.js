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

const users = []

const endpoint = "/users";

app.get(endpoint, function(req, res){
    res.send(users.filter(Boolean));
    // res.send(users);
});

app.get(`${endpoint}/:id`, function(req, res){
    const id = req.params.id;
    const user = users[id];

    if (!user){
        res.send("{}");
    } else {
        res.send(user);
    }   
});

app.post(endpoint, (req, res) => {
    const user = {
        id : users.length,
        username : req.body["username"],
        password : req.body["password"],
        email : req.body["email"]
    };
    users.push(user);
    res.send("1");

    notify();
});

app.put(`${endpoint}/:id`, (req, res) =>{
    const id = parseInt(req.params.id);
    const user = {
        id : id,
        username : req.body["username"],
        password : req.body["password"],
        email : req.body["email"]
    };

    users[id] = user;
    res.send("1");

    notify();
});

app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete users[id];
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

server.listen(process.env.PORT || 2000);