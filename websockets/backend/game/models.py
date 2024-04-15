# from django.db import models
# from django.contrib.auth.models import User

# STATUS_CHOICES = [
#     ('pending', 'Pending'),
#     ('ongoing', 'Ongoing'),
#     ('finished', 'Finished')
# ]

# MAP_CHOICES = [
#     ('egypt', 'Egypt'),
#     ('factory', 'Factory'),
#     ('space', 'Space')
# ]

# class GameHistory(models.Model):
#     id = models.AutoField(primary_key=True)
#     rome_name = models.CharField(max_length=255, unique=True)
#     player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player1')
#     player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player2')
#     player3 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player3', null=True, blank=True)
#     player4 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player4', null=True, blank=True)
#     team1_score = models.IntegerField(default=0)
#     team2_score = models.IntegerField(default=0)
#     date_created = models.DateTimeField(auto_now_add=True)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     game_map = models.CharField(max_length=20, choices=MAP_CHOICES, default='egypt')
#     is_one_vs_one = models.BooleanField(default=True)

#     class Meta:
#         verbose_name = "Game History"
#         verbose_name_plural = "Game Histories"

#     def __str__(self):
#         if self.is_one_vs_one:
#             return f'{self.player1.username} vs {self.player2.username}'
#         else:
#             return f'{self.player1.username} and {self.player2.username} vs {self.player3.username} and {self.player4.username}'
