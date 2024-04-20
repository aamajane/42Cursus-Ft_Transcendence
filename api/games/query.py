import graphene
from graphene_django import DjangoObjectType
from transcendence.db import users
from django.core.exceptions import ObjectDoesNotExist
from .models import Game


####################################################################################
### What queries revealed: #########################################################
### - getAllGames:
###    * input: none
###    * output: all the games
### - getAllGamesByState:
###    * input: state
###    * output: all the games by state (pending, ongoing, over)
### - getAllGamesPlayedByPlayer: retrieve all the games played by a player
###    * input: player (username)
###    * output: all the games played by a player and over
### - getLatestGamesByPlayer: retrieve the latest games played by a player
###    * input: player (username), limit (number of games)
###    * output: the latest games played by a player
####################################################################################


######## Documentation: ##############################################
### GameType class to define the fields that can be queried by the user
### from the database, used by graphene-django for GraphQL Compilance
#####################################################################

class GameType(DjangoObjectType):
    class Meta:
        model = Game
        fields = ('id', 'mode', 'score1', 'score2', 'is_vs_ai', 'is_2x2', 'state', 'player_1', 'player_2', 'player_3', 'player_4', 'is_team1_won',  'created_at', 'is_part_of_tournament')

######## Documentation: ##############################################
### Query class to define the queries that can be made by the user
### to retrieve data from the database
#####################################################################
        
class Query(graphene.ObjectType):

    ################################################
    ### GraphQL queries API definitions for Games
    ################################################

    ################################################
    ### Game queries to retrieve data
    ################################################

    # to retrieve all the games
    get_all_games = graphene.List(GameType)

    # input object type used to retrieve all the games played by a player
    class AllGamesByPlayerInput(graphene.InputObjectType):
        player = graphene.String(required=True)

    # to retrieve all the games played by a player
    get_all_games_played_by_player = graphene.List(GameType, data=AllGamesByPlayerInput(required=True))

    # input object type used to retrieve the latest games played by a player
    class LatestGamesByPlayerInput(graphene.InputObjectType):
        player = graphene.String(required=True)
        limit = graphene.Int(required=False)
    
    # to retrieve the latest games played by a player
    get_latest_games_by_player = graphene.List(GameType, data=LatestGamesByPlayerInput(required=True))

    # input object type used to retrieve all the games by status
    class AllGamesByStatus(graphene.InputObjectType):
        state = graphene.String(required=True)

    # to retrieve all the games by status
    get_all_games_by_state = graphene.List(GameType, data=AllGamesByStatus(required=True))

    # to retrieve a game by id
    get_game_by_id = graphene.Field(GameType, game_id=graphene.Int(required=True))

    ################################################
    ### Game resolvers to retrieve data
    ################################################

    # to retrieve all the games
    def resolve_get_all_games(self, info):
        return Game.objects.all()
    
    # to retrieve all the games by status
    def resolve_get_all_games_by_state(self, info, data):
        return Game.objects.filter(state=data.state)
    
    # to retrieve all the games played by a player, over and not part of a tournament
    def resolve_get_all_games_played_by_player(self, info, data):
        return Game.objects.filter(is_part_of_tournament=False) & Game.objects.filter(state="over") & (Game.objects.filter(player_1__username=data.player) | Game.objects.filter(player_2__username=data.player) | Game.objects.filter(player_3__username=data.player) | Game.objects.filter(player_4__username=data.player))

    # to retrieve the latest games played by a player, over and not part of a tournament
    def resolve_get_latest_games_by_player(self, info, data):
        return (Game.objects.filter(is_part_of_tournament=False) & Game.objects.filter(state="over") & (Game.objects.filter(player_1__username=data.player) | Game.objects.filter(player_2__username=data.player) | Game.objects.filter(player_3__username=data.player) | Game.objects.filter(player_4__username=data.player))).order_by('-created_at')[:data.limit]

    # to retrieve a game by id
    def resolve_get_game_by_id(self, info, game_id):
        try:
            return Game.objects.get(id=game_id)
        except ObjectDoesNotExist:
            return None