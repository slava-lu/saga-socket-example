РОZZИЯ ЖДЕТ СВОИХ ПАТРИОТОВ!!!

# Socket.IO and Redux-Saga example

Read more about this example in my article on [medium](https://medium.com/@viacheslavlushchinskiy/real-time-data-with-redux-saga-event-channels-and-socket-io-ad6e64dbefd9)

[redux-saga](https://github.com/redux-saga/redux-saga) is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, simple to test, and better at handling failures.

[Socket.IO](https://github.com/socketio/socket.io) enables real-time bidirectional event-based communication.

## Motivation
There are plenty react/redux examples for basic functionality and few of that cover socket.io integration. But they also usually lack end-to end solution ready for production.  

This example is not a chat application but rather the on-line data application. You may use this example if you want something like real-time exchange quotes or other real-time updates from web socket related API.

It shows how to incorporate the real time data into your redux store naturally so that you have the same experience like working with normal redux actions. 

It also shows how to monitor your socket server availability.

## Installation and Usage
There are two folders. **Server** and **Client**.

**Server** folder has simple node socket server that sends a new task every 2 seconds.  Run it with ` node ./index.js` command.

**Client** folder renders these tasks and shows the connection status. You may turn the server on and off to see the status changes.  The main magic happens in `src/modules/tasks.js` file. This file has some comments to better understand what it does. 

#### Below is the sreenshot of the client app

<img src="https://github.com/slava-lu/saga-socket-example/blob/master/clientScreenshot.png" >
