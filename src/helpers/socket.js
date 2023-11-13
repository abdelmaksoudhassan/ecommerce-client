import socket from 'socket.io-client'
export const io = socket('https://nodejs-ecommerce-o2e5.onrender.com',{
    withCredentials: true,
    autoConnect: false
})

io.on('connect',()=>{
  console.log('connected to server')
})
io.on('disconnect',()=>{
  console.log('disconnected to server')
})