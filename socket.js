const Metrica = require("./models/tb_metrica");

const activeRooms = {}; // Armazena os IDs das salas ativas

function generateRoomId() {
    // Gera um ID de sala único (por exemplo, um UUID)
    return Math.random().toString(36).substr(2, 9);
  }
module.exports = (socket, io) => {
    console.log('novo cliente')
    console.log('socket id', socket?.id)
    const clienteData = new Map()

    const roomId = generateRoomId(); // Gere um ID de sala único
    socket.join(roomId);
    activeRooms[socket.id] = roomId;

    socket.on('playEvent', (body) => {

        console.log(`Nova visualização`)
        console.log(`video assistido é ${JSON.stringify(body)}`)
        clienteData.set(socket.id, body)
    })

    socket.on('play', (bool) => {
        const data = clienteData.get(socket.id)

        const body = {
            ...data,
            ...bool
        }
        console.log(body)
        clienteData.set(socket.id, body)
    })

    socket.on('disconnect', async () => {
        console.log('Cliente desconectado');
        const currentRoomId = activeRooms[socket.id];
        const data = clienteData.get(socket.id)
        await Metrica.create(data)
        console.log('data', data)
      if (currentRoomId) {
        delete activeRooms[socket.id];
      }
      });
  
   
  
    /* socket.on("chat message", async (msg) => {
      const currentRoomId = activeRooms[socket.id]; // Obtém a sala ativa do cliente
      if (currentRoomId) {
        }
    }); */
  
  };
  