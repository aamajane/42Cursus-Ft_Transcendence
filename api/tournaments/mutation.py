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
    semi_final_first_game_mode = graphene.String(required=True)
    semi_final_second_game_mode = graphene.String(required=True)
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
    
            # if semi_final_first_game_mode provided but not valid
            if data.semi_final_first_game_mode is not None and data.semi_final_first_game_mode not in ['egypt', 'factory', 'space']:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for semi final first game mode')
    
            # if semi_final_second_game_mode provided but not valid
            if data.semi_final_second_game_mode is not None and data.semi_final_second_game_mode not in ['egypt', 'factory', 'space']:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for semi final second game mode')
    
            # if final_game_mode provided but not valid
            if data.final_game_mode is not None and data.final_game_mode not in ['egypt', 'factory', 'space']:
                return CreateTournament(tournament_id=None, success=None, error='Invalid input for final game mode')
    
            try:
                tournament_hoster_user = User.objects.get(username=data.tournament_hoster)
    
                # creating a new tournament
                tournament = Tournament(tournament_hoster=tournament_hoster_user, 
                            semi_final_first_game_mode=data.semi_final_first_game_mode, 
                            semi_final_second_game_mode=data.semi_final_second_game_mode, 
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

            # determining all the games modes for the tournament
            modes = ['egypt', 'factory', 'space']
            semi_final_first_game_mode = random.choice(modes)
            modes.pop(modes.index(semi_final_first_game_mode))
            semi_final_second_game_mode = random.choice(modes)
            modes.pop(modes.index(semi_final_second_game_mode))
            final_game_mode = modes[0]
            

            
            # creating all the tournament games
            try:
                semi_final_first_game = Game(mode=semi_final_first_game_mode, state='pending')
                semi_final_first_game.save()

                semi_final_second_game = Game(mode=semi_final_second_game_mode, state='pending')
                semi_final_second_game.save()

                final_game = Game(mode=final_game_mode, state='pending')
                final_game.save()

                tournament = Tournament(tournament_hoster=tournament_hoster, 
                                semi_final_first_game=semi_final_first_game, 
                                semi_final_second_game=semi_final_second_game, 
                                final_game=final_game,
                                state='pending',
                                )
                tournament.save()
            except Exception as e:
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

class GetAvailableTournament(graphene.Mutation):
    class Arguments:
        pass

    tournament_id = graphene.ID()
    semi_final_first_game_id = graphene.ID()
    semi_final_second_game_id = graphene.ID()
    final_game_id = graphene.ID()
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info):
        try:
            tournaments = Tournament.objects.filter(state='pending')
            if len(tournaments) >= 1:
                return GetAvailableTournament(tournament_id=tournaments[0].id, 
                                                semi_final_first_game_id=tournaments[0].semi_final_first_game.id, 
                                                semi_final_second_game_id=tournaments[0].semi_final_second_game.id, 
                                                final_game_id=tournaments[0].final_game.id, 
                                                success='Tournament available', 
                                                error=None)
            raise Exception('No tournament available')
        except Exception as e:

            # create the 3 games
            try:
                tournament = Tournament(state='pending')
                tournament.save()
                semi_final_first_game = Game(mode='egypt', state='pending', is_part_of_tournament=True, tournament_id=tournament)
                semi_final_second_game = Game(mode='factory', state='pending', is_part_of_tournament=True, tournament_id=tournament)
                final_game = Game(mode='space', state='pending', is_part_of_tournament=True, tournament_id=tournament)
                semi_final_second_game.save()
                semi_final_first_game.save()
                final_game.save()
                tournament.semi_final_first_game = semi_final_first_game
                tournament.semi_final_second_game = semi_final_second_game
                tournament.final_game = final_game
                tournament.save()
                return GetAvailableTournament(tournament_id=tournament.id, 
                                                semi_final_first_game_id=semi_final_first_game.id, 
                                                semi_final_second_game_id=semi_final_second_game.id, 
                                                final_game_id=final_game.id, 
                                                success='Tournament created successfully', 
                                                error=None)
            except Exception as e:
                return GetAvailableTournament(tournament_id=None, success=None, error='Error creating games or the whole tournament!')

class DeleteAllTournaments(graphene.Mutation):
    class Arguments:
        pass

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info):
        try:
            all_tournaments = Tournament.objects.all()
            for e in all_tournaments:
                e.delete()
            return DeleteAllTournaments(success='All tournaments deleted successfully', error=None)
        except Exception as e:
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
    get_available_tournament = GetAvailableTournament.Field()
    
    # set game state
    set_tournament_state = SetTournamentState.Field()
