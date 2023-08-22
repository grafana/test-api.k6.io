import json
import time

from autobahn.exception import Disconnected
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class CrocoChatRoom(AsyncJsonWebsocketConsumer):

    def _get_name(self):
        return self.scope["session"].get('name', 'anonymous')

    def _set_name(self, new_name):
        self.scope["session"]['name'] = new_name

    async def connect(self):
        print(f"{self._get_name()} Connected")
        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'room': self.room_name,
            'message': f'{self._get_name()} joined',
            "user": self._get_name(),
            "event": "USER_JOINED"
        })


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Receive message from WebSocket and reply
        """
        try:
            response = json.loads(text_data)
        except:
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'room': self.room_name,
                'received_json': text_data,
                "event": "ERROR",
                'message': f"Invalid JSON sent",
            })
            return

        event = response.get("event", 'unspecified')
        message = response.get("message", "nothing")

        if event == 'SAY':
            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                "event": "CHAT_MSG",
                'room': self.room_name,
                "user": self._get_name(),

                'message': message,
            })
        elif event == 'LEAVE':
            print(f"{self._get_name()} wants to leave")
            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                "event": "LEAVE",
                'room': self.room_name,
                "user": self._get_name(),

                'message': f"{self._get_name()} leaves now.",
            })
            await self.close(3000)

        elif event == 'SET_NAME':
            old_name = self._get_name()
            new_name = response.get('new_name', 'name')

            self._set_name(new_name)

            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                "event": "NAME_CHANGE",
                'room': self.room_name,
                "user": self._get_name(),

                'message': f"User {old_name} changed name to '{new_name}'",
            })


        elif event == 'unspecified':
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'room': self.room_name,
                "user": self._get_name(),
                "event": "ERROR",

                'message': f"ERROR someone sent an invalid command",
            })


    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket
        try:
            await self.send(text_data=json.dumps(res))
        except Disconnected:
            # Attempted to send on a closed socket
            pass
