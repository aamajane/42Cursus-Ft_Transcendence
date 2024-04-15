from django.db import models
from users.models import User

# Create your models here.
class Game(models.Model):
    id = models.AutoField(primary_key=True)
    mode = models.CharField(max_length=100) # game mode: egypt, space or classic
    is_vs_ai = models.BooleanField(default=False) # is the game vs computer
    is_2x2 = models.BooleanField(default=False) # is the game 2x2
    state = models.CharField(max_length=100) # game status: pending, playing, finished
    game_hoster = models.ForeignKey(User, related_name='game_hoster', on_delete=models.PROTECT, null=True, blank=True) # game hoster username
    player_1 = models.ForeignKey(User, related_name='player1', on_delete=models.PROTECT, null=True, blank=True) # player 1 username
    player_2 = models.ForeignKey(User, related_name='player2', on_delete=models.PROTECT, null=True, blank=True) # player 2 username
    player_3 = models.ForeignKey(User, related_name='player3', on_delete=models.PROTECT, null=True, blank=True) # player 3 username
    player_4 = models.ForeignKey(User, related_name='player4', on_delete=models.PROTECT, null=True, blank=True) # player 4 username
    is_team1_won = models.BooleanField(default=False) # player 1 won the game
    is_part_of_tournament = models.BooleanField(default=False) # is the game part of a tournament
    created_at = models.DateTimeField(auto_now_add=True)
