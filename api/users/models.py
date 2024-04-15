from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100, primary_key=True, unique=True)
    password = models.CharField(max_length=2048)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    friends = models.ManyToManyField('self', blank=True)
    email = models.CharField(max_length=2000, blank=True)
    avatar_url = models.CharField(max_length=2000, default='https://i.imgur.com/0vW1xRb.png', blank=True)
    is_online = models.BooleanField(default=False)
    is_playing = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0, db_index=True)
    number_of_followers = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user', db_index=True)
    followed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followed_by', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    relevancy_score = models.IntegerField(default=0, db_index=True)

class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=2000)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)