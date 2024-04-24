import json
from channels.generic.websocket import AsyncWebsocketConsumer


class TournamentConsumer(AsyncWebsocketConsumer):
    MAX_USERS = 4
    user_count = {}
    players = {}
    channels_names = {}
    tournament_status = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['tournament_id']
        self.room_group_name = f'room_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        self.user_count.setdefault(self.room_group_name, 0)
        self.players.setdefault(self.room_group_name, [])
        self.channels_names.setdefault(self.room_group_name, [])
        self.tournament_status.setdefault(self.room_group_name, 'pending')

        self.user_count[self.room_group_name] += 1

        if self.user_count[self.room_group_name] > self.MAX_USERS:
            await self.close()
            return

        await self.accept()

        if self.tournament_status[self.room_group_name] == 'pending':
            self.channels_names[self.room_group_name].append(self.channel_name)

            await self.channel_layer.send(self.channel_name, {
                'type': 'send.message',
                'event': 'player_connected'
            })

            if self.user_count[self.room_group_name] == self.MAX_USERS:
                await self.channel_layer.group_send(self.room_group_name, {
                    'type': 'send.message',
                    'event': 'tournament_ongoing'
                })
                self.tournament_status[self.room_group_name] = 'ongoing'

                await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                    'type': 'send.message',
                    'event': 'play_semifinal_first_game',
                })
                await self.channel_layer.send(self.channels_names[self.room_group_name][1], {
                    'type': 'send.message',
                    'event': 'play_semifinal_first_game',
                })
                await self.channel_layer.send(self.channels_names[self.room_group_name][2], {
                    'type': 'send.message',
                    'event': 'play_semifinal_second_game',
                })
                await self.channel_layer.send(self.channels_names[self.room_group_name][3], {
                    'type': 'send.message',
                    'event': 'play_semifinal_second_game',
                })

    async def disconnect(self, close_code):
        self.user_count[self.room_group_name] -= 1

        if self.tournament_status[self.room_group_name] == 'pending':
            channel_name_index = self.channels_names[self.room_group_name].index(self.channel_name)
            player = self.players[self.room_group_name][channel_name_index]
            self.players[self.room_group_name].remove(player)
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'remove_player',
                'players': self.players[self.room_group_name]
            })

            if self.channel_name in self.channels_names[self.room_group_name]:
                self.channels_names[self.room_group_name].remove(self.channel_name)

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get('event')

        if event in ['add_player']:
            player = data.get('player')
            self.players[self.room_group_name].append(player)
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'add_player',
                'players': self.players[self.room_group_name]
            })

        if event in ['play_final_game']:
            await self.channel_layer.send(self.channel_name, {
                'type': 'send.message',
                'event': 'play_final_game'
            })

        if event in ['tournament_over']:
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'tournament_over'
            })
            self.game_status[self.room_group_name] = 'over'

    async def send_message(self, data):
        await self.send(text_data=json.dumps({'data': data}))
