import { randomString, randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

import ws from 'k6/ws';
import { check, sleep } from 'k6';

let sessionDuration = randomIntBetween(2000, 5000);
let chatRoomName = 'publicRoom'; // choose your name

export default function () {
  let url = 'ws://127.0.0.1:8000/ws/crocochat/xxx/';
  let params = { tags: { my_tag: 'my ws session' } };

  let res = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      console.log(`VU ${__VU}: connected`);

      socket.send(JSON.stringify({'event': 'SET_NAME', 'new_name': `Croc ${__VU}`}));

      socket.setInterval(function timeout() {
        socket.send(JSON.stringify({'event': 'SAY', 'message': `I'm saying ${randomString(5)}`}));
      }, randomIntBetween(2000, 8000)); // say something every 2-8seconds
    });

    socket.on('ping', function () {
      console.log('PING!');
    });

    socket.on('pong', function () {
      console.log('PONG!');
    });

    socket.on('close', function () {
      console.log(`VU ${__VU}: disconnected`);
    });

    socket.on('message', function (message){
      // console.log(`Received message: ${message}`);
      let msg = JSON.parse(message);
      if(msg.event === 'CHAT_MESSAGE'){
        console.log(`VU ${__VU}: Received Message: ${msg.message}`)
      }
      else if(msg.event === 'ERROR'){
        console.error(`VU ${__VU}: Received Message: ${msg.message}`)
      }
      else{
        console.log(`VU ${__VU}: ${msg.message}`)
      }

    });

    socket.setTimeout(function () {
      console.log(`${sessionDuration}ms passed, leaving the chat`);
      socket.send(JSON.stringify({'event': 'LEAVE'}));

      sleep(3);
      // force close
      socket.close();

    }, sessionDuration);

    // socket.setTimeout(function () {
    //   console.log(`Closing the socket forcefully`);
    //   socket.close();
    // }, sessionDuration+3000);


  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
