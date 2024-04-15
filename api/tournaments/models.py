from django.db import models
from games.models import Game
from users.models import User

# Create your models here.
class Tournament(models.Model):
    id = models.AutoField(primary_key=True)
    demi_final_first_game = models.ForeignKey(Game, related_name='demi_final_first_game', on_delete=models.PROTECT) # game 1 id
    demi_final_second_game = models.ForeignKey(Game, related_name='demi_final_second_game', on_delete=models.PROTECT) # game 2 id
    final_game = models.ForeignKey(Game, related_name='final_game', on_delete=models.PROTECT) # game 3 id
    state = models.CharField(max_length=100) # tournament status: pending, playing, finished
    tournament_hoster = models.ForeignKey(User, related_name='tournament_hoster', on_delete=models.PROTECT, null=True, blank=True) # tournament hoster username
    winner = models.ForeignKey(User, related_name='winner', on_delete=models.PROTECT, null=True, blank=True) # winner game id
    second_place = models.ForeignKey(User, related_name='second_place', on_delete=models.PROTECT, null=True, blank=True) # second place game id
    third_place = models.ForeignKey(User, related_name='third_place', on_delete=models.PROTECT, null=True, blank=True) # third place game id
    fourth_place = models.ForeignKey(User, related_name='fourth_place', on_delete=models.PROTECT, null=True, blank=True) # fourth place game id
    created_at = models.DateTimeField(auto_now_add=True)