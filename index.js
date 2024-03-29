require('dotenv/config')
const express = require('express')
const app = express()

const mongoose = require('mongoose')
const cors = require('cors')
const { resolve } = require('path')
const http = require('http')
const socketio = require('socket.io')

const routes = require('./src/routes')


app.set('port', process.env.PORT || 3333)

const server = http.Server(app)
const io = socketio(server)

mongoose.connect(
  process.env.MONGODB_URL.toString(),
  {
     useNewUrlParser: true, 
     useUnifiedTopology: true 
  }
)

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

app.use(cors())
app.use(express.json())
app.use('/files', express.static(resolve(__dirname, '.', 'uploads')));

app.use(routes)

server.listen(process.env.PORT || 3333)
