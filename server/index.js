const Koa = require('koa');
const socketIO = require('socket.io');

const app = new Koa();
const server = app.listen(3000);

const io = socketIO(server);
let i = 0;

//this makes sure we have unique task IDs when starting an stopping rhe server
let baseTaskID = Math.round((Date.now() - 1511098000000)/1000);

console.log('Server started');
setInterval(() => i++, 2000);

io.on("connection", (socket) => {
    console.log("Connection opened");
    setInterval(() => {
            socket.emit("newTask", {
                taskName: `Task ${baseTaskID + i}`,
                taskID: baseTaskID + i
            })
        }, 2000
    )
});
