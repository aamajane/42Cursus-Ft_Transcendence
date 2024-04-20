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
    player_1 = graphene.String()
    player_2 = graphene.String()
    player_3 = graphene.String()
    player_4 = graphene.String()
    mode = graphene.String() # egypt, factory or space, random if not provided
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


        if data.state is not None and data.state not in ['pending', 'ongoing', 'over']:
            return CreateGame(game_id=None, success=None, error='Invalid input for state')

        if data.mode is not None and data.mode not in ['egypt', 'factory', 'space']:
            return CreateGame(game_id=None, success=None, error='Invalid input for mode')

        try:
            player_1_user = User.objects.get(username=data.player_1) if data.player_1 is not None else None
            player_2_user = User.objects.get(username=data.player_2) if data.player_2 is not None else None
            player_3_user = User.objects.get(username=data.player_3) if data.player_3 is not None else None
            player_4_user = User.objects.get(username=data.player_4) if data.player_4 is not None else None

            # creating a new game
            game = Game(player_1=player_1_user, 
                        player_2=player_2_user, 
                        player_3=player_3_user,
                        player_4=player_4_user,
                        mode=data.mode if data.mode is not None else random.choice(['factory', 'egypt', 'space']), # egypt, factory or space
                        is_2x2=True if data.is_2x2 else False,  # 2vs2 mode
                        is_vs_ai=True if data.is_vs_ai else False, # vs AI mode
                        state='pending' if data.state is None else data.state)
            game.save()
            return CreateGame(game_id=game.id, success="Game created successfully!", error=None)
        except User.DoesNotExist:
            return CreateGame(game_id=None, success=None, error='Invalid input for players')

class DeleteGame(graphene.Mutation):
    class Arguments:
        game_id = graphene.Int(required=True)

    game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, game_id):
        try:
            game = Game.objects.get(id=game_id)
            game.delete()
            return DeleteGame(success='Game deleted successfully', error=None)
        except Game.DoesNotExist:
            return DeleteGame(success=None, error='Game does not exist')

class GetAvailableGame(graphene.Mutation):
    class Arguments:
        mode = graphene.String()
        state = graphene.String()
        is_2x2 = graphene.Boolean()
        is_vs_ai = graphene.Boolean()

    game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, mode=None, state='pending', is_2x2=False, is_vs_ai=False):
        try:
            if mode is not None and mode not in ['egypt', 'factory', 'space']:
                return GetAvailableGame(game_id=None, success=None, error='Invalid input for mode')
            games = Game.objects.filter(state='pending', is_2x2=is_2x2, mode=mode)
            if len(games) >= 1:
                return GetAvailableGame(game_id=games[0].id, success='Game found', error=None)
            raise Exception('No available games found')
        except Exception as e:
            try:
                game = Game.objects.create(
                    mode= mode if mode else random.choice(['factory', 'egypt', 'space']),
                    state=state,
                    is_2x2=is_2x2,
                    is_vs_ai=is_vs_ai
                    )
            except Exception as e:
                return GetAvailableGame(game_id=None, success=None, error='Invalid input for game')
            return GetAvailableGame(game_id=game.id, success="Game created successfully!", error=None)

class UpdateGameInput(graphene.InputObjectType):
    game_id = graphene.Int(required=True)
    player_1 = graphene.String()
    player_2 = graphene.String()
    player_3 = graphene.String()
    player_4 = graphene.String()
    winner = graphene.String()
    mode = graphene.String()
    is_2x2 = graphene.Boolean()
    is_vs_ai = graphene.Boolean()
    state = graphene.String()
    score1 = graphene.Int()
    score2 = graphene.Int()

class UpdateGame(graphene.Mutation):
    class Arguments:
        data = UpdateGameInput(required=True)

    game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
        if data.state is not None and data.state not in ['pending', 'ongoing', 'over']:
            return UpdateGame(game_id=None, success=None, error='Invalid input for state')

        if data.mode is not None and data.mode not in ['egypt', 'factory', 'space']:
            return UpdateGame(game_id=None, success=None, error='Invalid input for mode')

        try:
            game = Game.objects.get(id=data.game_id)

            if data.state is not None and ['pending', 'ongoing', 'over'].index(game.state) > ['pending', 'ongoing', 'over'].index(data.state):
                return UpdateGame(game_id=None, success=None, error='Invalid state transition')

            if data.player_1 is not None:
                player_1_user = User.objects.get(username=data.player_1)
                game.player_1 = player_1_user

            if data.player_2 is not None:
                player_2_user = User.objects.get(username=data.player_2)
                game.player_2 = player_2_user

            if data.player_3 is not None:
                player_3_user = User.objects.get(username=data.player_3)
                game.player_3 = player_3_user

            if data.player_4 is not None:
                player_4_user = User.objects.get(username=data.player_4)
                game.player_4 = player_4_user

            if data.winner is not None:
                winner_user = User.objects.get(username=data.winner)
                game.winner = winner_user

            if data.mode is not None:
                game.mode = data.mode

            if data.is_2x2 is not None:
                game.is_2x2 = data.is_2x2

            if data.is_vs_ai is not None:
                game.is_vs_ai = data.is_vs_ai

            if data.state is not None:
                game.state = data.state

            if data.score1 is not None:
                game.score1 = data.score1
            
            if data.score2 is not None:
                game.score2 = data.score2

            game.save()
            return UpdateGame(game_id=game.id, success='Game updated successfully', error=None)
        except User.DoesNotExist:
            return UpdateGame(game_id=None, success=None, error='Invalid input for players')
        except Game.DoesNotExist:
            return UpdateGame(game_id=None, success=None, error='Game does not exist')

class DeleteAllGames(graphene.Mutation):
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info):
        try:
            games = Game.objects.all()
            for game in games:
                game.delete()
            return DeleteAllGames(success='All games deleted successfully', error=None)
        except Game.DoesNotExist:
            return DeleteAllGames(success=None, error='No games found')

####### Documentation: ##############################################
#### - Mutation class
### - a class that contains all the mutations
#####################################################################
class Mutation(ObjectType):

    # for creating a new game
    create_game = CreateGame.Field()

    # delete a game
    delete_game = DeleteGame.Field()

    # get an available game for playing
    get_available_game = GetAvailableGame.Field()

    # update all the game parameters
    update_game = UpdateGame.Field()

    # delete all games
    delete_all_games = DeleteAllGames.Field()