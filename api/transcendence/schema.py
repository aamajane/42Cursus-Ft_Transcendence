import graphene
from users.query import Query as UsersQuery
from games.query import Query as GamesQuery
from tournaments.query import Query as TournamentsQuery
# from authentication.query import Query as AuthQuery
# from authentication.mutation import Mutation as AuthMutation
from users.mutation import Mutation as UsersMutation
from games.mutation import Mutation as GamesMutation
from tournaments.mutation import Mutation as TournamentsMutation


### DOCUMENTATION: #########################################################
### - This is the main schema that combines all the queries and mutations ###
### - from the different apps                                             ###
###########################################################################
class Query(UsersQuery, GamesQuery, TournamentsQuery):
    pass

class Mutation(UsersMutation, GamesMutation, TournamentsMutation):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)