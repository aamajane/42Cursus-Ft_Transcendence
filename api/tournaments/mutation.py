import graphene
import random
from graphene.types import ObjectType
from django.core.exceptions import ObjectDoesNotExist
from .models import Tournament
from games.models import Game
from users.models import User

MAX_TOURNAMENTS_TO_CREATE = 100

####### Documentation: ##############################################
#### - Mutation class
### - a class that contains all the mutations
#####################################################################

class CreateTournamentInput(graphene.InputObjectType):
    tournament_hoster = graphene.String(required=True)
    demi_final_first_game_mode = graphene.String(required=True)
    demi_final_second_game_mode = graphene.String(required=True)
    final_game_mode = graphene.String(required=True)


class CreateTournament(graphene.Mutation):
    class Arguments:
        data = CreateTournamentInput(required=True)

    tournament_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
            
            # we cannot create a tournament if there is no tournament_hoster provided
            if data.tournament_hoster is None:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for tournament hoster')
    
            # if demi_final_first_game_mode provided but not valid
            if data.demi_final_first_game_mode is not None and data.demi_final_first_game_mode not in ['egypt', 'factory', 'space']:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for demi final first game mode')
    
            # if demi_final_second_game_mode provided but not valid
            if data.demi_final_second_game_mode is not None and data.demi_final_second_game_mode not in ['egypt', 'factory', 'space']:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for demi final second game mode')
    
            # if final_game_mode provided but not valid
            if data.final_game_mode is not None and data.final_game_mode not in ['egypt', 'factory', 'space']:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for final game mode')
    
            try:
                tournament_hoster_user = User.objects.get(username=data.tournament_hoster)
    
                # creating a new tournament
                tournament = Tournament(tournament_hoster=tournament_hoster_user, 
                            demi_final_first_game_mode=data.demi_final_first_game_mode, 
                            demi_final_second_game_mode=data.demi_final_second_game_mode, 
                            final_game_mode=data.final_game_mode)
                tournament.save()
    
                return CreateTournament(tournament_id=tournament.id, success='Tournament created successfully', error=None)
            except ObjectDoesNotExist:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for tournament hoster')

class CreateTournamentsInput(graphene.InputObjectType):
    number_of_tournaments = graphene.Int(required=True)

class CreateTournaments(graphene.Mutation):
    class Arguments:
        data = CreateTournamentsInput(required=True)
    
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
        # we cannot create a tournament if we surpass a certain number of tournaments
        if data.number_of_tournaments <= 0 or data.number_of_tournaments > MAX_TOURNAMENTS_TO_CREATE:
            return CreateTournaments(success=None, error='Invalid input for number of tournaments')


        for i in range(data.number_of_tournaments):
            tournament_hoster = None

            print('Before modes')
            # determining all the games modes for the tournament
            modes = ['egypt', 'factory', 'space']
            demi_final_first_game_mode = random.choice(modes)
            print('After first choice')
            modes.pop(modes.index(demi_final_first_game_mode))
            print(modes)
            demi_final_second_game_mode = random.choice(modes)
            print('After second choice')
            modes.pop(modes.index(demi_final_second_game_mode))
            final_game_mode = modes[0]
            print('Final choice')
            

            
            # creating all the tournament games
            try:
                demi_final_first_game = Game(mode=demi_final_first_game_mode, state='pending')
                demi_final_first_game.save()

                demi_final_second_game = Game(mode=demi_final_second_game_mode, state='pending')
                demi_final_second_game.save()

                final_game = Game(mode=final_game_mode, state='pending')
                final_game.save()

                tournament = Tournament(tournament_hoster=tournament_hoster, 
                                demi_final_first_game=demi_final_first_game, 
                                demi_final_second_game=demi_final_second_game, 
                                final_game=final_game,
                                state='pending',
                                )
                print('Tournament', i, ' created')
                tournament.save()
            except Exception as e:
                print('Error creating tournament games', e)
                return CreateTournaments(success=None, error='Error creating tournament games')
        return CreateTournaments(success='Tournaments created successfully', error=None)    

class ChangeTournamentHosterInput(graphene.InputObjectType):
    tournament_id = graphene.ID(required=True)
    new_tournament_hoster = graphene.String(required=True)

class ChangeTournamentHoster(graphene.Mutation):
    class Arguments:
        data = ChangeTournamentHosterInput(required=True)

    tournament_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
        try:
            tournament = Tournament.objects.get(id=data.tournament_id)
            new_tournament_hoster_user = User.objects.get(username=data.new_tournament_hoster)
            tournament.tournament_hoster = new_tournament_hoster_user
            tournament.save()
            return ChangeTournamentHoster(success='Tournament hoster changed successfully', error=None)
        except ObjectDoesNotExist:
            return ChangeTournamentHoster(success=None, error='Invalid input for tournament id or new tournament hoster')

class DeleteTournamentInput(graphene.InputObjectType):
    tournament_id = graphene.ID(required=True)

class DeleteTournament(graphene.Mutation):
    class Arguments:
        data = DeleteTournamentInput(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, data):
        try:
            tournament = Tournament.objects.get(id=data.tournament_id)
            tournament.delete()
            return DeleteTournament(success='Tournament deleted successfully', error=None)
        except ObjectDoesNotExist:
            return DeleteTournament(success=None, error='Invalid input for tournament id')

class GetTournamentAvailable(graphene.Mutation):
    class Arguments:
        pass

    tournament_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info):
        try:
            tournaments = Tournament.objects.filter(state='pending')
            if len(tournaments) >= 1:
                return GetTournamentAvailable(tournament_id=tournaments[0].id, success='Tournament available', error=None)
            raise Exception('No tournament available')
        except Exception as e:

            # create the 3 games
            try:
                tournament = Tournament(state='pending')
                tournament.save()
                demi_final_first_game = Game(mode='egypt', state='pending', is_part_of_tournament=True, tournament_id=tournament)
                demi_final_second_game = Game(mode='factory', state='pending', is_part_of_tournament=True, tournament_id=tournament)
                final_game = Game(mode='space', state='pending', is_part_of_tournament=True, tournament_id=tournament)
                demi_final_second_game.save()
                demi_final_first_game.save()
                final_game.save()
                tournament.demi_final_first_game = demi_final_first_game
                tournament.demi_final_second_game = demi_final_second_game
                tournament.final_game = final_game
                tournament.save()
                return GetTournamentAvailable(tournament_id=tournament.id, success='Tournament available', error=None)
            except Exception as e:
                print("EXCEPTION => ", e)
                return GetTournamentAvailable(tournament_id=None, success=None, error='Error creating games or the whole tournament!')

class DeleteAllTournaments(graphene.Mutation):
    class Arguments:
        pass

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info):
        try:
            all_tournaments = Tournament.objects.all()
            print('After all')
            for e in all_tournaments:
                print("ELEMENT => ", e)
                e.delete()
            print('All tournaments', all_tournaments)
            return DeleteAllTournaments(success='All tournaments deleted successfully', error=None)
        except Exception as e:
            print("EXCEPTION => ", e)
            return DeleteAllTournaments(success=None, error='Error deleting all tournaments')

class SetTournamentState(graphene.Mutation):
    class Arguments:
        tournament_id = graphene.ID(required=True)
        state = graphene.String(required=True)

    
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, tournament_id, state):
        try:
            if state not in ['pending', 'ongoing', 'over']:
                return SetTournamentState(success=None, error='Invalid input for tournament state')
            tournament = Tournament.objects.get(id=tournament_id)
            if ['pending', 'ongoing', 'over'].index(tournament.state) > ['pending', 'ongoing', 'over'].index(state):
                return SetTournamentState(success=None, error='Invalid input for tournament state')
            tournament.state = state
            tournament.save()
            return SetTournamentState(success='Tournament state changed successfully', error=None)
        except ObjectDoesNotExist:
            return SetTournamentState(success=None, error='Invalid input for tournament id')

class Mutation(ObjectType):
    # to create a new tournament
    create_tournament = CreateTournament.Field()

    # to create a bunch of tournaments
    create_tournaments = CreateTournaments.Field()

    # to change the tournament hoster
    change_tournament_hoster = ChangeTournamentHoster.Field()

    # to delete the tournament
    delete_tournament = DeleteTournament.Field()

    # to delete all tournaments
    delete_all_tournaments = DeleteAllTournaments.Field()

    # to get the available tournament
    get_tournament_available = GetTournamentAvailable.Field()
    
    # set game state
    set_tournament_state = SetTournamentState.Field()
