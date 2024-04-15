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
        fields = ('id', 'demi_final_first_game', 'demi_final_second_game', 'final_game', 'state', 'name', 'tournament_hoster', 'winner', 'second_place', 'third_place', 'fourth_place', 'created_at')

class Query(graphene.ObjectType):

    ################################################
    ### GraphQL queries API definitions for Tournaments
    ################################################

    ################################################
    ### Tournament queries to retrieve data
    ################################################

    ### getTournamentByState ########################################################
    # input object type used to retrieve all the tournaments by status
    class TournamentByState(graphene.InputObjectType):
        state = graphene.String(required=True)
    
    # to retrieve all the tournaments by status
    get_tournament_by_state = graphene.Field(TournamentType, data=TournamentByState(required=True))


    # to retrieve all the tournaments
    get_all_tournaments = graphene.List(TournamentType)

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