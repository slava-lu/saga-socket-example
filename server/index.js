const Koa = require('koa');
const socketIO = require('socket.io');

const app = new Koa();
const server = app.listen(3000);

const io = socketIO(server);
let i = 0;
console.log('Server started');
setInterval(() => i++, 2000);

io.on("connection", (socket) => {
    console.log("Connection opened");
    setInterval(() => {
            socket.emit("newTask", {
                taskName: `Task ${i}`,
                taskID: i
            })
        }, 2000
    )
});
