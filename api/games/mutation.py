import graphene
import random
from graphene.types import ObjectType
from .models import Game
from users.models import User

####### Documentation: ##############################################
#### - Mutation class
### - a class that contains all the mutations
#####################################################################

class CreateGameInput(graphene.InputObjectType):
    player_1 = graphene.String(required=True)
    player_2 = graphene.String(required=True)
    player_3 = graphene.String()
    player_4 = graphene.String()
    mode = graphene.String() # egypt, classic or space, random if not provided
    is_2x2 = graphene.Boolean()
    is_vs_ai = graphene.Boolean()
    state = graphene.String()

class CreateGame(graphene.Mutation):
    class Arguments:
        data = CreateGameInput(required=True)

    game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):

        # we cannot create a 2x2 game without player 3 and player 4
        if data.is_2x2 and (data.player_3 is None or data.player_4 is None):
            return CreateGame(game_id=None, success=None, error='Invalid input for 2x2 mode')

        # we cannot create a vs AI game with player 3 or player 4
        if data.is_vs_ai and (data.player_3 is not None or data.player_4 is not None):
            return CreateGame(game_id=None, success=None, error='Invalid input for vs AI mode')

        # # we cannot create a game if there is no player_1 or there is no player_2 provided
        # if data.player_1 is None or data.player_2 is None:
        #     return CreateGame(game_id=None, success=None, error='Invalid input for players')

        # if status provided but not valid
        if data.state is not None and data.state not in ['pending', 'playing', 'finished']:
            return CreateGame(game_id=None, success=None, error='Invalid input for state')

        # if mode provided but not valid
        if data.mode is not None and data.mode not in ['egypt', 'classic', 'space']:
            return CreateGame(game_id=None, success=None, error='Invalid input for mode')

        try:
            player_1_user = User.objects.get(username=data.player_1)
            player_2_user = User.objects.get(username=data.player_2)
            player_3_user = User.objects.get(username=data.player_3) if data.player_3 is not None else None
            player_4_user = User.objects.get(username=data.player_4) if data.player_4 is not None else None

            # creating a new game
            game = Game(player_1=player_1_user, 
                        player_2=player_2_user, 
                        player_3=player_3_user, # if none then player_3 is none (1vs1 mode) 
                        player_4=player_4_user, # if none then payer_4 is none (1vs1 mode)
                        mode=data.mode if data.mode is not None else random.choice(['classic', 'egypt', 'space']), # egypt, classic or space
                        is_2x2=True if data.is_2x2 else False,  # 2vs2 mode
                        is_vs_ai=True if data.is_vs_ai else False, # vs AI mode
                        state='pending' if data.state is None else data.state)
            game.save()
            return CreateGame(game_id=game.id, success="Game created successfully!", error=None)
        except User.DoesNotExist:
            return CreateGame(game_id=None, success=None, error='Invalid input for players')

####### Documentation: ##############################################
#### - SetGameStatus class
### - a mutation that sets the state of the game
#####################################################################

class SetGameWinnerInput(graphene.InputObjectType):
    game_id = graphene.Int(required=True)
    state = graphene.String(required=True)

class SetGameState(graphene.Mutation):
    class Arguments:
        data = SetGameWinnerInput(required=True)

    game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
        # change the game state
        try:
            game = Game.objects.get(id=data.game_id)
            game.state = data.state
            game.save()
            return SetGameState(game_id=data.game_id, success='Game state changed successfully', error=None)
        except Game.DoesNotExist:
            return SetGameState(game_id=None, success=None, error='Game does not exist')

####### Documentation: ##############################################
#### - SetGameWinner class
### - a mutation that sets the winner of the game
#####################################################################

class SetGameWinnerInput(graphene.InputObjectType):
    game_id = graphene.Int(required=True)
    winner = graphene.String(required=True)

class SetGameWinner(graphene.Mutation):
    class Arguments:
        data = SetGameWinnerInput(required=True)

    game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
        # set the winner of the game
        try:
            game = Game.objects.get(id=data.game_id)
            if game.player_1 == data.winner or game.player_3 == data.winner:
                game.is_team1_won = True
            else:
                game.is_team1_won = False
            game.save()
            return SetGameWinner(game_id=data.game.id, success='Game winner set successfully', error=None)
        except Game.DoesNotExist:
            return SetGameWinner(game_id=None, success=None, error='Game does not exist')


####### Documentation: ##############################################\
#### - DeleteGame class
### - a mutation that deletes a game
#####################################################################

class DeleteGameInput(graphene.InputObjectType):
    game_id = graphene.Int(required=True)

class DeleteGame(graphene.Mutation):
    class Arguments:
        data = DeleteGameInput(required=True)

    game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
        try:
            game = Game.objects.get(id=data.game_id)
            game.delete()
            return DeleteGame(success='Game deleted successfully', error=None)
        except Game.DoesNotExist:
            return DeleteGame(success=None, error='Game does not exist')


####### Documentation: ##############################################
#### - Mutation class
### - a class that contains all the mutations
#####################################################################
class Mutation(ObjectType):

    # for creating a new game
    create_game = CreateGame.Field()

    # change game status
    set_game_state = SetGameState.Field()

    # set the winner of the game
    set_game_winner = SetGameWinner.Field()

    # delete a game
    delete_game = DeleteGame.Field()