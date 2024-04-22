from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100, primary_key=True, unique=True)
    nickname = models.CharField(max_length=100, blank=True) # can be edited
    password = models.CharField(max_length=2048)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=2000, blank=True)
    avatar_url = models.CharField(max_length=2000, default='http://localhost/app/assets/images/anonimous.jpeg', blank=True)
    is_online = models.BooleanField(default=False)
    is_playing = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0, db_index=True)
    number_of_followers = models.IntegerField(default=0)
    number_of_following = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    oauth2_platform = models.CharField(max_length=100, blank=True) # [google, intra42], etc
    two_factor_auth = models.BooleanField(default=False) # two factor authentication

class Followership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user', db_index=True)
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    relevancy_score = models.IntegerField(default=0, db_index=True)

class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=2000)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)