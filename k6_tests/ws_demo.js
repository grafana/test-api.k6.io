import { randomString, randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import ws from 'k6/ws';
import { check, sleep } from 'k6';


// This example uses the `k6/ws` module. 
// `k6/experimental/websockets` is a new module with a better and standard API. We recommend using the new API. 

let sessionDuration = randomIntBetween(5000, 60000); // user session between 5s and 1m
let chatRoomName = 'publicRoom'; // choose your chat room name

export let options = {
  duration: '20s',
  vus: 5,
};

const conf = {
  baseURL: __ENV.BASE_URL || "wss://test-api.k6.io",
}

export default function () {
  let url = `${conf.baseURL}/ws/crocochat/${chatRoomName}/`;
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
      let msg = JSON.parse(message);
      if(msg.event === 'CHAT_MSG'){
        console.log(`VU ${__VU} received: ${msg.user} says: ${msg.message}`)
      }
      else if(msg.event === 'ERROR'){
        console.error(`VU ${__VU} received:: ${msg.message}`)
      }
      else{
        console.log(`VU ${__VU} received unhandled message: ${msg.message}`)
      }
    });

    socket.setTimeout(function () {
      console.log(`VU ${__VU}: ${sessionDuration}ms passed, leaving the chat`);
      socket.send(JSON.stringify({'event': 'LEAVE'}));

    }, sessionDuration);

    socket.setTimeout(function () {
      console.log(`Closing the socket forcefully 3s after graceful LEAVE`);
      socket.close();
    }, sessionDuration+3000);
  });

  check(res, { 'Connected successfully': (r) => r && r.status === 101 });
}
