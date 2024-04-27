import graphene
from graphene_django import DjangoObjectType
from .models import User
from .models import Followership
from .models import Notification
from transcendence.db import users
from .utils import get_username_from_token_decode_strictly, format_url, verify_access_token, get_username_from_token
from django.core.exceptions import ObjectDoesNotExist
from transcendence.settings import INTRA42_CLIENT_ID, INTRA42_CLIENT_SECRET, INTRA42_REDIRECT_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from transcendence.middleware import GraphQLProtectedResource

######## Documentation: ##############################################
### UserType class to define the fields that can be queried by the user
### from the database, used by graphene-django for GraphQL Compilance
#####################################################################

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "nickname", "two_factor_auth", "email", "avatar_url", "created_at", "is_online", "is_playing", "points_earned", "number_of_followers", "number_of_following")

######## Documentation: ##############################################
### FriendType class to define the fields that can be queried by the user
### from the database, used by graphene-django for GraphQL Compilance
#####################################################################

class FollowershipType(DjangoObjectType):
    class Meta:
        model = Followership
        fields = ("following", "user", "created_at", "relevancy_score")

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

    ################################################
    ### Notification queries to retrieve data
    ################################################

    # to retrieve all notifications of a user
    get_all_notifications = graphene.List(NotificationType, username=graphene.String(required=True))

    # to retrieve all the unread notifications of a user
    get_all_unread_notifications = graphene.List(NotificationType, username=graphene.String(required=True))

    # to retrieve the number of unread notifications of a user
    get_number_of_unread_notifications = graphene.Int(username=graphene.String(required=True), limit=graphene.Int())


    ################################################
    ### Followers queries to retrieve data
    ################################################

    # to retrieve the number of followers of a user
    get_number_of_followers = graphene.Int(username=graphene.String(required=True))

    # to retrieve the number of followers a user is following
    get_number_of_followings = graphene.Int(username=graphene.String(required=True))

    # to retrieve the followers of a user
    get_user_followers = graphene.List(FollowershipType, username=graphene.String(required=True), limit=graphene.Int())

    # to retrieve the users that a user is following
    get_user_following = graphene.List(FollowershipType, username=graphene.String(required=True), limit=graphene.Int())

    # to retrieve users that has a substring in their username
    get_users_by_substring = graphene.List(UserType, substring=graphene.String(required=True))

    # to retrieve who ami using the access token, takes access token and returns back the username
    who_am_i = graphene.Field(graphene.String(), access_token=graphene.String(required=True))

    ################################################
    ### GraphQL resolvers for the queries        ###
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


    ################################################
    ### Followers resolvers to retrieve data
    ################################################

    # to retrieve the followers of a user
    def resolve_get_number_of_followers(root, info, username):
        try:
            user = User.objects.get(username=username)
            return Followership.objects.filter(following=user).count()
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist

    # to retrieve the number of followers a user is following
    def resolve_get_number_of_followings(root, info, username):
        try:
            user = User.objects.get(username=username)
            return Followership.objects.filter(user=user).count()
        except ObjectDoesNotExist:
            return None  # Return None if the user does not exist

    # to retrieve all the users following a user
    def resolve_get_user_followers(root, info, username):
        try:
            user = User.objects.get(username=username)
            followers = Followership.objects.filter(following=user)
            return followers
        except ObjectDoesNotExist:
            return None # Return None if the user does not exist
        
    # to retrieve the users that a user is following
    def resolve_get_user_following(root, info, username):
        try:
            user = User.objects.get(username=username)
            followers = Followership.objects.filter(user=user)
            return followers
        except ObjectDoesNotExist:
            return None # Return None if the user does not exist

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
    
    # to retrieve users that has a substring in their username
    def resolve_get_users_by_substring(root, info, substring):
        return User.objects.filter(nickname__icontains=substring)

    # to retrieve who ami using the access token
    def resolve_who_am_i(root, info, access_token):
        username = get_username_from_token_decode_strictly(access_token)
        return username