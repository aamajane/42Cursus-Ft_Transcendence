import json
from channels.generic.websocket import AsyncWebsocketConsumer

# GAME_WIDTH = 900
# GAME_HEIGHT = 2100

# BALL_SIZE = 35
# BALL_RADIUS = BALL_SIZE / 2
# BALL_MAX_SPEED = 35
# BALL_X = GAME_WIDTH / 2
# BALL_Y = GAME_HEIGHT / 2

# PADDLE_SPEED = 20
# PADDLE_WIDTH = 160
# PADDLE_HEIGHT = 80
# PLAYER_PADDLE_X = GAME_WIDTH / 2 - PADDLE_WIDTH / 2
# PLAYER_PADDLE1_X = GAME_WIDTH / 4 - PADDLE_WIDTH / 2
# PLAYER_PADDLE2_X = GAME_WIDTH - GAME_WIDTH / 4 - PADDLE_WIDTH / 2
# OPPONENT_PADDLE_X = GAME_WIDTH / 2 - PADDLE_WIDTH / 2
# OPPONENT_PADDLE1_X = GAME_WIDTH - GAME_WIDTH / 4 - PADDLE_WIDTH / 2
# OPPONENT_PADDLE2_X = GAME_WIDTH / 4 - PADDLE_WIDTH / 2

# WINNING_SCORE = 10

class BaseGameConsumer(AsyncWebsocketConsumer):
    MAX_USERS = None
    user_count = {}
    channels_names = {}
    game_status = {}
    # ball_x = {}
    # ball_y = {}
    # player1_paddle_x = {}
    # player2_paddle_x = {}
    # opponent1_paddle_x = {}
    # opponent2_paddle_x = {}
    # player_score = {}
    # opponent_score = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f'room_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        self.user_count.setdefault(self.room_group_name, 0)
        self.channels_names.setdefault(self.room_group_name, [])
        self.game_status.setdefault(self.room_group_name, 'pending')
        # self.ball_x.setdefault(self.room_group_name, BALL_X)
        # self.ball_y.setdefault(self.room_group_name, BALL_Y)
        # self.player1_paddle_x.setdefault(self.room_group_name, PLAYER_PADDLE1_X)
        # self.player2_paddle_x.setdefault(self.room_group_name, PLAYER_PADDLE2_X)
        # self.opponent1_paddle_x.setdefault(self.room_group_name, OPPONENT_PADDLE1_X)
        # self.opponent2_paddle_x.setdefault(self.room_group_name, OPPONENT_PADDLE2_X)
        # self.player_score.setdefault(self.room_group_name, 0)
        # self.opponent_score.setdefault(self.room_group_name, 0)

        self.user_count[self.room_group_name] += 1

        if self.user_count[self.room_group_name] > self.MAX_USERS or self.game_status[self.room_group_name] != 'pending':
            await self.close()
            return

        await self.accept()

        self.channels_names[self.room_group_name].append(self.channel_name)

        if self.user_count[self.room_group_name] == self.MAX_USERS:
            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message',
                'event': 'host_true'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message',
                'event': 'team_one'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message',
                'event': 'paddle_level_one'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][1], {
                'type': 'send.message',
                'event': 'team_two'
            })

            await self.channel_layer.send(self.channels_names[self.room_group_name][1], {
                'type': 'send.message',
                'event': 'paddle_level_one'
            })

            if self.MAX_USERS == 4:
                await self.channel_layer.send(self.channels_names[self.room_group_name][2], {
                    'type': 'send.message',
                    'event': 'team_one'
                })

                await self.channel_layer.send(self.channels_names[self.room_group_name][2], {
                    'type': 'send.message',
                    'event': 'paddle_level_two'
                })

                await self.channel_layer.send(self.channels_names[self.room_group_name][3], {
                    'type': 'send.message',
                    'event': 'team_two'
                })

                await self.channel_layer.send(self.channels_names[self.room_group_name][3], {
                    'type': 'send.message',
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
                'type': 'send.message',
                'event': 'host_true'
            })

        if self.game_status[self.room_group_name] == 'ongoing' and self.user_count[self.room_group_name] == 1:
            await self.channel_layer.send(self.channels_names[self.room_group_name][0], {
                'type': 'send.message',
                'event': 'give_up'
            })
            self.game_status[self.room_group_name] = 'over'

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get('event')

        if event in ['update_user_data', 'update_paddle', 'update_score', 'update_ball']:
            # if await self.valid_input(data, event) is False:
            #     return
            await self.channel_layer.group_send(self.room_group_name, {
                'sender_channel_name': self.channel_name,
                'type': 'send.message',
                **data
            })

        if event in ['update_host']:
            channel_name_index = self.channels_names[self.room_group_name].index(self.channel_name)
            channel_name_index_new_host = (channel_name_index + 1) % self.MAX_USERS
            await self.channel_layer.send(self.channels_names[self.room_group_name][channel_name_index_new_host], {
                'type': 'send.message',
                'event': 'host_true'
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

    # async def valid_input(self, data, event):
    #     if event == 'update_ball':
    #         ball_new_x = data.get('ball_x')
    #         ball_new_y = data.get('ball_y')
    #         ball_top = ball_new_y - BALL_RADIUS
    #         ball_bottom = ball_new_y + BALL_RADIUS
    #         ball_left = ball_new_x - BALL_RADIUS
    #         ball_right = ball_new_x + BALL_RADIUS

    #         if ball_top > GAME_HEIGHT or ball_bottom < 0:
    #             return False

    #         if ball_left < 0 or ball_right > GAME_WIDTH:
    #             return False

    #         min_ball_x = self.ball_x[self.room_group_name] - BALL_MAX_SPEED
    #         max_ball_x = self.ball_x[self.room_group_name] + BALL_MAX_SPEED
    #         if ball_new_x < min_ball_x or ball_new_x > max_ball_x:
    #             return False

    #         min_ball_y = self.ball_y[self.room_group_name] - BALL_MAX_SPEED
    #         max_ball_y = self.ball_y[self.room_group_name] + BALL_MAX_SPEED
    #         if ball_new_y < min_ball_y or ball_new_y > max_ball_y:
    #             return False

    #         self.ball_x[self.room_group_name] = ball_new_x
    #         self.ball_y[self.room_group_name] = ball_new_y

    #     if event == 'update_paddle':
    #         team = data.get('team')
    #         paddle_level = data.get('paddle_level')
    #         paddle_new_x = data.get('paddle_x')
    #         paddle_left = paddle_new_x
    #         paddle_right = paddle_new_x + PADDLE_WIDTH

    #         if paddle_left < 0 or paddle_right > GAME_WIDTH:
    #             return False

    #         if team == 'team_one' and paddle_level == 1:
    #             if paddle_new_x < self.player1_paddle_x[self.room_group_name] - PADDLE_SPEED or \
    #             paddle_new_x > self.player1_paddle_x[self.room_group_name] + PADDLE_SPEED:
    #                 return False
    #             else:
    #                 self.player1_paddle_x[self.room_group_name] = paddle_new_x

    #         if team == 'team_two' and paddle_level == 1:
    #             if paddle_new_x < self.opponent1_paddle_x[self.room_group_name] - PADDLE_SPEED or \
    #             paddle_new_x > self.opponent1_paddle_x[self.room_group_name] + PADDLE_SPEED:
    #                 return False
    #             else:
    #                 self.opponent1_paddle_x[self.room_group_name] = paddle_new_x

    #         if team == 'team_one' and paddle_level == 2:
    #             if paddle_new_x < self.player2_paddle_x[self.room_group_name] - PADDLE_SPEED or \
    #             paddle_new_x > self.player2_paddle_x[self.room_group_name] + PADDLE_SPEED:
    #                 return False
    #             else:
    #                 self.player2_paddle_x[self.room_group_name] = paddle_new_x

    #         if team == 'team_two' and paddle_level == 2:
    #             if paddle_new_x < self.opponent2_paddle_x[self.room_group_name] - PADDLE_SPEED or \
    #             paddle_new_x > self.opponent2_paddle_x[self.room_group_name] + PADDLE_SPEED:
    #                 return False
    #             else:
    #                 self.opponent2_paddle_x[self.room_group_name] = paddle_new_x

    #     if event == 'update_score':
    #         score_player = data.get('score_player')
    #         score_opponent = data.get('score_opponent')

    #         if score_player < self.player_score[self.room_group_name] or score_player > self.player_score[self.room_group_name] + 1:
    #             return False

    #         if score_opponent < self.opponent_score[self.room_group_name] or score_opponent > self.opponent_score[self.room_group_name] + 1:
    #             return False

    #         self.player_score[self.room_group_name] = score_player
    #         self.opponent_score[self.room_group_name] = score_opponent

    #     return True

class OneVsOneConsumer(BaseGameConsumer):
    MAX_USERS = 2


class TwoVsTwoConsumer(BaseGameConsumer):
    MAX_USERS = 4
