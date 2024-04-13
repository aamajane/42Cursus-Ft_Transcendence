import json
from channels.generic.websocket import AsyncWebsocketConsumer


class TournamentConsumer(AsyncWebsocketConsumer):
    MAX_USERS = 4
    user_count = {}
    usernames = {}
    tournament_status = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['tournament_id']
        self.room_group_name = f'room_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        self.user_count.setdefault(self.room_group_name, 0)
        self.usernames.setdefault(self.room_group_name, [])
        self.tournament_status.setdefault(self.room_group_name, 'pending')

        self.user_count[self.room_group_name] += 1

        if self.user_count[self.room_group_name] > self.MAX_USERS:
            await self.close()
            return
        
        await self.accept()

        self.usernames[self.room_group_name].append(self.scope['user'].username)

        await self.send_player_number_message(self.user_count[self.room_group_name])

        if self.user_count[self.room_group_name] == self.MAX_USERS:
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'start'
            })
            self.tournament_status[self.room_group_name] = 'ongoing'

    async def disconnect(self, close_code):
        self.user_count[self.room_group_name] -= 1

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_message(self, data):
        if data.get('sender_channel_name') != self.channel_name:
            await self.send(text_data=json.dumps({'data': data}))

    async def send_player_number_message(self, player_number):
        await self.send_message_back({
            'event': 'player_number',
            'player_number': player_number
        })

    async def send_message_back(self, data):
        await self.send(text_data=json.dumps({'data': data}))
