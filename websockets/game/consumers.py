import json
from channels.generic.websocket import AsyncWebsocketConsumer


class BaseGameConsumer(AsyncWebsocketConsumer):
    MAX_USERS = None
    user_count = {}
    channels_names = {}
    game_status = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'room_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        self.user_count.setdefault(self.room_group_name, 0)
        self.channels_names.setdefault(self.room_group_name, [])
        self.game_status.setdefault(self.room_group_name, 'pending')

        self.user_count[self.room_group_name] += 1

        if self.user_count[self.room_group_name] > self.MAX_USERS or self.game_status[self.room_group_name] != 'pending':
            await self.close()
            return

        await self.accept()

        self.channels_names[self.room_group_name].append(self.channel_name)

        # await self.send_host_message(self.user_count[self.room_group_name] == 1)
        # await self.send_team_message('team_one' if self.user_count[self.room_group_name] in [1, 3] else 'team_two')
        # await self.send_paddle_level_message('paddle_level_one' if self.user_count[self.room_group_name] in [1, 2] else 'paddle_level_two')

        if self.user_count[self.room_group_name] == self.MAX_USERS:
            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message.back',
                'event': 'host_true'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message.back',
                'event': 'team_one'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message.back',
                'event': 'paddle_level_one'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][1], {
                'type': 'send.message.back',
                'event': 'team_two'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][1], {
                'type': 'send.message.back',
                'event': 'paddle_level_one'
            })

            if self.MAX_USERS == 4:
                await self.channel_layer.send(self.channels_names[self.room_group_name][2], {
                    'type': 'send.message.back',
                    'event': 'team_one'
                })

                await self.channel_layer.send(self.channels_names[self.room_group_name][2], {
                    'type': 'send.message.back',
                    'event': 'paddle_level_two'
                })

                await self.channel_layer.send(self.channels_names[self.room_group_name][3], {
                    'type': 'send.message.back',
                    'event': 'team_two'
                })

                await self.channel_layer.send(self.channels_names[self.room_group_name][3], {
                    'type': 'send.message.back',
                    'event': 'paddle_level_two'
                })

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'game_ongoing'
            })
            self.game_status[self.room_group_name] = 'ongoing'

    async def disconnect(self, close_code):
        self.user_count[self.room_group_name] -= 1

        if self.channel_name in self.channels_names[self.room_group_name]:
            self.channels_names[self.room_group_name].remove(self.channel_name)

        if self.game_status[self.room_group_name] == 'ongoing':
            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message.back',
                'event': 'host_true'
            })

        if self.game_status[self.room_group_name] == 'ongoing' and self.user_count[self.room_group_name] == 1:
            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message.back',
                'event': 'give_up'
            })
            self.game_status[self.room_group_name] = 'over'

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get('event')

        if event in ['update_user_data', 'update_paddle', 'update_score', 'update_ball']:
            await self.channel_layer.group_send(self.room_group_name, {
                'sender_channel_name': self.channel_name,
                'type': 'send.message',
                **data
            })

        if event in ['game_over']:
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send.message',
                'event': 'game_over'
            })
            self.game_status[self.room_group_name] = 'over'

    async def send_message(self, data):
        if data.get('sender_channel_name') != self.channel_name:
            await self.send(text_data=json.dumps({'data': data}))

    async def send_message_back(self, data):
        await self.send(text_data=json.dumps({'data': data}))

    # async def send_host_message(self, is_host):
    #     await self.send_message_back({'event': 'host_true' if is_host else 'host_false'})

    # async def send_team_message(self, team):
    #     await self.send_message_back({'event': team})

    # async def send_paddle_level_message(self, level):
    #     await self.send_message_back({'event': level})


class OneVsOneConsumer(BaseGameConsumer):
    MAX_USERS = 2


class TwoVsTwoConsumer(BaseGameConsumer):
    MAX_USERS = 4
