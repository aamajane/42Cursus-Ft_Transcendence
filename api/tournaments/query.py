import graphene
from graphene_django import DjangoObjectType
from graphene.types import ObjectType
from django.core.exceptions import ObjectDoesNotExist
from games.models import Game
from users.models import User
from .models import Tournament


class TournamentType(DjangoObjectType):
    class Meta:
        model = Tournament
        fields = ('id', 'demi_final_first_game', 'demi_final_second_game', 'final_game', 'state', 'tournament_hoster', 'winner', 'second_place', 'third_place', 'fourth_place', 'created_at')

class Query(graphene.ObjectType):

    ################################################
    ### GraphQL queries API definitions for Tournaments
    ################################################

    ################################################
    ### Tournament queries to retrieve data
    ################################################
    
    # to retrieve all the tournaments by status
    get_available_tournament = graphene.Field(TournamentType)


    # to retrieve all the tournaments
    get_all_tournaments = graphene.List(TournamentType)

    # input object type used to retrieve all the tournaments by user
    class AllTournamentsByUserInput(graphene.InputObjectType):
        username = graphene.String(required=True)

    # to retrieve all the tournaments played by the user username
    get_tournaments_played_by_user = graphene.List(TournamentType, data=AllTournamentsByUserInput(required=True))


    ################################################
    ### Tournament resolvers to retrieve data
    ################################################

    def resolve_get_tournament_by_state(self, info, data):
        try:
            if data.state is None:
                return None
            return Tournament.objects.get(state=data.state)
        except ObjectDoesNotExist:
            return None

    
    def resolve_get_all_tournaments(self, info):
        return Tournament.objects.all()
    

    def resolve_get_tournaments_played_by_user(self, info, data):
        try:
            user = User.objects.get(username=data.username)
            return Tournament.objects.filter(demi_final_first_game__player_1=user)\
                | Tournament.objects.filter(demi_final_first_game__player_2=user)\
                | Tournament.objects.filter(demi_final_first_game__player_3=user)\
                | Tournament.objects.filter(demi_final_first_game__player_4=user)\
                | Tournament.objects.filter(demi_final_second_game__player_1=user)\
                | Tournament.objects.filter(demi_final_second_game__player_2=user)\
                | Tournament.objects.filter(demi_final_second_game__player_3=user)\
                | Tournament.objects.filter(demi_final_second_game__player_4=user)
        except ObjectDoesNotExist:
            return None