// <!-- BUTA-ANON -->
// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

io.on('connection', (socket) => {

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {

    // we store the username in the socket session for this client
    socket.username = username;
    socket.emit('login');
  });

});






















// // var app = require('express')();
// // var http = require('http').createServer(app);
// // var port = process.env.PORT || 3000

// // // Serving HTML
// // app.get('/', function (req, res) {
// //     res.sendFile(__dirname + '/index.html');
// // });

// // http.listen(port, function () {
// //     console.log('listening on *:' + port);
// // });


// // <!-- BUTA-ANON -->
// // Setup basic express server
// var express = require('express');
// var app = express();
// var path = require('path');
// var http = require('http').createServer(app);
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// var port = process.env.PORT || 8081;

// http.listen(port, function () {
//     console.log('listening on *:' + port);
// });

// // Routing
// app.use(express.static(path.join(__dirname, 'public')));

// // Serving HTML
// // app.get('/', function (req, res) {
// //     res.sendFile(__dirname + 'index.html');
// // });

// // Chatroom

// io.on('connection', (socket) => {

//   // when the client emits 'new message', this listens and executes
//   socket.on('new message', (data) => {
//     // we tell the client to execute 'new message'
//     socket.broadcast.emit('new message', {
//       username: socket.username,
//       message: data
//     });
//   });

//   // when the client emits 'add user', this listens and executes
//   socket.on('add user', (username) => {

//     // we store the username in the socket session for this client
//     socket.username = username;
//     socket.emit('login');
//   });

// });












// // var http = require('http');

// // //create a server object:
// // http.createServer(function (req, res) {
// //   res.write('Hello World!'); //write a response to the client
// //   res.end(); //end the response
// // }).listen(8080); //the server object listens on port 8080