const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')

const routes = require('./routes')

const app = express()
const server = http.Server(app)
const io = socketio(server)

const port = process.env.PORT || 3333
const uriLocal = process.env.MONGODB || 'mongodb+srv://edivaldosilva:asd085456255669@omnistack-ko67z.mongodb.net/semana09?retryWrites=true&w=majority'
mongoose.connect(
  uriLocal,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// mongoose.connect(
//   uriLocal,
//   { useNewUrlParser: true, useUnifiedTopology: true }
// )

const connectedUsers = {}

io.on('connection', socket => {
  const { user_id } = socket.handshake.query

  connectedUsers[user_id] = socket.id
})

app.use((req, res, next) => {
  req.io = io
  req.connectedUsers = connectedUsers

  return next()
})

// GET, POST, PUT, DELETE

// req.query = Acessar query params (para filtros)
// req.params = Acessar route params (para edição, delete)
// req.body = Acessar corpo da requisição (para criação, edição)

app.use(cors())
app.use(express.json())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)

server.listen(port)
