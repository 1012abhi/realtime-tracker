import express from 'express';
import { Server } from 'socket.io';
import http from 'http'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express(); 

const server = http.createServer(app)
const io = new Server(server);


app.set('view engine', 'ejs')

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")))
// Serve static files from the 'css' directory
// app.use('/css', express.static(path.join(__dirname, 'css')));

// // Serve static files from the 'js' directory
// app.use('/js', express.static(path.join(__dirname, 'js')));

io.on("connection", function(socket) {
    socket.on("sent-location", function(data) {
        io.emit("receive-location", {id: socket.id, ...data});
    })
    console.log("connected");
    
    socket.on("disconnect", function(socket) {
        io.emit("user-disconnected", socket.id);
    })
})

app.get("/", (req, res) => {
    res.render("index")
})

server.listen(3000, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log("Server is running on http://localhost:3000");
    }    
})