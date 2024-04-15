import json
from channels.generic.websocket import AsyncWebsocketConsumer


class TournamentConsumer(AsyncWebsocketConsumer):
    MAX_USERS = 4
    user_count = {}
    usernames = {}
    channels_names = {}
    tournament_status = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['tournament_id']
        self.room_group_name = f'room_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        self.user_count.setdefault(self.room_group_name, 0)
        self.usernames.setdefault(self.room_group_name, [])
        self.channels_names.setdefault(self.room_group_name, [])
        self.tournament_status.setdefault(self.room_group_name, 'pending')

        self.user_count[self.room_group_name] += 1

        if self.user_count[self.room_group_name] > self.MAX_USERS:
            await self.close()
            return

        await self.accept()

        if self.tournament_status[self.room_group_name] == 'pending':
            self.usernames[self.room_group_name].append(self.scope['user'].username)
            self.channels_names[self.room_group_name].append(self.channel_name)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'update_usernames',
                'usernames': self.usernames[self.room_group_name]
            })

            if self.user_count[self.room_group_name] == self.MAX_USERS:
                await self.channel_layer.group_send(self.room_group_name, {
                    'type': 'send.message',
                    'event': 'ongoing'
                })
                self.tournament_status[self.room_group_name] = 'ongoing'
                await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                    'type': 'send.message',
                    'event': 'play_game1',
                })
                await self.channel_layer.send(self.channels_names[self.room_group_name][1], {
                    'type': 'send.message',
                    'event': 'play_game1',
                })
                await self.channel_layer.send(self.channels_names[self.room_group_name][2], {
                    'type': 'send.message',
                    'event': 'play_game2',
                })
                await self.channel_layer.send(self.channels_names[self.room_group_name][3], {
                    'type': 'send.message',
                    'event': 'play_game2',
                })

        else:
            if self.scope['user'].username in self.usernames[self.room_group_name]:
                await self.send_message_back({'event': 'play_game3'})

    async def disconnect(self, close_code):
        self.user_count[self.room_group_name] -= 1

        if self.tournament_status[self.room_group_name] == 'pending':
            if self.scope['user'].username in self.usernames[self.room_group_name]:
                self.usernames[self.room_group_name].remove(self.scope['user'].username)

            if self.channel_name in self.channels_names[self.room_group_name]:
                self.channels_names[self.room_group_name].remove(self.channel_name)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'update_usernames',
                'usernames': self.usernames[self.room_group_name]
            })

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get('event')

        if event in ['update_tournament']:
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                **data
            })

    async def send_message(self, data):
        await self.send(text_data=json.dumps({'data': data}))

    async def send_message_back(self, data):
        await self.send(text_data=json.dumps({'data': data}))
