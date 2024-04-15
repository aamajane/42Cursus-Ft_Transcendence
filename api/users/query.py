import graphene
from graphene_django import DjangoObjectType
from .models import User
from .models import Friend
from .models import Notification
from transcendence.db import users
from django.core.exceptions import ObjectDoesNotExist

######## Documentation: ##############################################
### UserType class to define the fields that can be queried by the user
### from the database, used by graphene-django for GraphQL Compilance
#####################################################################

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "friends", "email", "avatar_url", "created_at", "is_online", "is_playing", "points_earned", "number_of_followers")

######## Documentation: ##############################################
### FriendType class to define the fields that can be queried by the user
### from the database, used by graphene-django for GraphQL Compilance
#####################################################################

class FriendType(DjangoObjectType):
    class Meta:
        model = Friend
        fields = ("followed_by", "created_at")

######## Documentation: ##############################################
### NotificationType class to define the fields that can be queried by the user
### from the database, used by graphene-django for GraphQL Compilance
#####################################################################

class NotificationType(DjangoObjectType):
    class Meta:
        model = Notification
        fields = ("user", "message", "is_read", "created_at", "id")

######## Documentation: ##############################################    
### Query class to define the queries that can be made by the user
### to retrieve data from the database
#####################################################################

class Query(graphene.ObjectType):

    ################################################
    ### GraphQL queries API definitions for Users, 
    ### Friends & Notifications
    ################################################

    ################################################
    ### User queries to retrieve data
    ################################################
    
    # to retrieve all the users
    get_all_users = graphene.List(UserType)

    # to retrieve a user by username
    get_user_by_username = graphene.Field(UserType, username=graphene.String(required=True))

    # to retrieve the users ordered by creation date, descending is the default
    get_users_ordered_by_creation_date = graphene.List(UserType, asc=graphene.Boolean(), limit=graphene.Int())

    # to retrieve the users ordered by points earned, descending is the default
    get_users_ordered_by_points_earned = graphene.List(UserType, asc=graphene.Boolean(), limit=graphene.Int())


    ################################################
    ### Friend queries to retrieve data
    ################################################

    # to retrieve the number of friends of a user
    get_friends_of_user = graphene.List(FriendType, username=graphene.String(required=True), limit=graphene.Int())

    # to retrieve all the friends of a user
    get_all_friends = graphene.List(FriendType, username=graphene.String(required=True))

    # to retrieve the friends of a user ordered by followership date
    get_friends_of_user_ordered_by_date_of_followership = graphene.List(FriendType, asc=graphene.Boolean(), username=graphene.String(required=True), limit=graphene.Int())

    # to retrieve the friends of a user ordered by creation date
    get_friends_of_user_ordered_by_relevancy_score = graphene.List(FriendType, asc=graphene.Boolean(), username=graphene.String(required=True), limit=graphene.Int())


    ################################################
    ### Notification queries to retrieve data
    ################################################

    # to retrieve all notifications of a user
    get_all_notifications = graphene.List(NotificationType, username=graphene.String(required=True))

    # to retrieve notifications
    get_notifications = graphene.List(NotificationType, username=graphene.String(required=True), limit=graphene.Int())

    # to retrieve all the unread notifications of a user
    get_all_unread_notifications = graphene.List(NotificationType, username=graphene.String(required=True))

    # to retrieve the number of unread notifications of a user
    get_number_of_unread_notifications = graphene.Int(username=graphene.String(required=True), limit=graphene.Int())


    ################################################
    ### GraphQL resolvers for the queries
    ###
    ################################################

    ################################################
    ### User resolvers to retrieve data
    ################################################

    # to retrieve all the users
    def resolve_get_all_users(root, info, **kwargs):
        return User.objects.all()

    # to retrieve a user by username
    def resolve_get_user_by_username(root, info, username):
        try:
            return User.objects.get(username=username)
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist

    # to retrieve the users ordered by creation date, asc=True is the default (from oldest to newest)
    def resolve_get_users_ordered_by_creation_date(root, info, asc=True, limit=None):
        users = User.objects.all().order_by('-created_at') if asc else User.objects.all().order_by('created_at')
        if limit is not None:
            users = users[:limit]
        return users

    # to retrieve the users ordered by points earned, asc=False is the default (from highest to lowest points)
    def resolve_get_users_ordered_by_points_earned(root, info, asc=False, limit=None):
        users = User.objects.all().order_by('-points_earned')
        if limit is not None:
            users = users[:limit]
        return users

    ################################################
    ### Friend resolvers to retrieve data
    ################################################

    # to retrieve the friends of a user
    def resolve_get_friends_of_user(root, info, username, limit=None):
        try:
            user = User.objects.get(username=username)
            friends = Friend.objects.filter(user=user)
            if limit is not None:
                friends = friends[:limit]
            return friends
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist

    # to retrieve all the friends of a user
    def resolve_get_all_friends(root, info, username):
        try:
            user = User.objects.get(username=username)
            return Friend.objects.filter(user=user)
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist

    # to retrieve the friends of a user ordered by followership date
    def resolve_get_friends_of_user_ordered_by_date_of_followership(root, info, username, limit=None):
        try:
            user = User.objects.get(username=username)
            friends = Friend.objects.filter(user=user).order_by('-created_at')
            if limit is not None:
                friends = friends[:limit]
            return friends
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist

    # to retrieve the friends of a user ordered by relevancy score
    def resolve_get_friends_of_user_ordered_by_relevancy_score(root, info, username, limit=None):
        try:
            user = User.objects.get(username=username)
            friends = Friend.objects.filter(user=user).order_by('-relevancy_score')
            if limit is not None:
                friends = friends[:limit]
            return friends
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist
    
    ################################################
    ### Notification resolvers to retrieve data
    ################################################

    # to retrieve all notifications of a user
    def resolve_get_all_notifications(root, info, username):
        try:
            user = User.objects.get(username=username)
            return Notification.objects.filter(user=user)
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist
    
    # to retrieve notifications
    def resolve_get_notifications(root, info, username, limit=None):
        try:
            user = User.objects.get(username=username)
            notifications = Notification.objects.filter(user=user)
            if limit is not None:
                notifications = notifications[:limit]
            return notifications
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist
    
    # to retrieve all the unread notifications of a user
    def resolve_get_all_unread_notifications(root, info, username):
        try:
            user = User.objects.get(username=username)
            return Notification.objects.filter(user=user, is_read=False)
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist

    # to retrieve the number of unread notifications of a user
    def resolve_get_number_of_unread_notifications(root, info, username):
        try:
            user = User.objects.get(username=username)
            return Notification.objects.filter(user=user, is_read=False).count()
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist
