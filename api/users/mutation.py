import graphene
from graphene.types import ObjectType
from transcendence.db import users, in_users
from users.models import User, Notification, Friend
from transcendence.utils import hash_password, verify_password

####### Documentation: ##############################################
#### - Create a new user
### - a mutation that creates a new user, always returns 
### access_token and refresh_tokens as cookies with httponly=True
#####################################################################
class CreateUser(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, first_name, last_name, username, password):
        # find if the user already exists in the database User model or not
        is_user_not_exist = not User.objects.filter(username=username).exists()
        
        if is_user_not_exist:
            User.objects.create(first_name=first_name, last_name=last_name, username=username, password=hash_password(password))
            return CreateUser(success="User created successfully", error=None)
        return CreateUser(success=None, error="User already exists")

####### Documentation: ##############################################
#### - Update a user
### - a mutation that updates a user, always returns 
### success and error return values fields
#####################################################################
class UpdateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        new_username = graphene.String()
        new_password = graphene.String()
        new_first_name = graphene.String()
        new_last_name = graphene.String()
        new_email = graphene.String()

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, new_username=None, new_password=None, new_first_name=None, new_last_name=None, new_email=None):

        # each field provided will be updated
        try: # try to update the user
            user = User.objects.filter(username=username).first()
            if new_username: # updating the username field
                user.username = new_username
            if new_password: # updating the password field
                user.password = hash_password(new_password)
            if new_first_name: # updating the first_name field
                user.first_name = new_first_name
            if new_last_name: # updating the last_name field
                user.last_name = new_last_name
            if new_email: # updating the email field
                user.email = new_email
            user.save()
            return UpdateUser(success='User updated successfully!', error=None)
        except Exception as e: # user update failed because there is no user with the given username
            return UpdateUser(success=None, error='Error occured during updating the user!')

####### Documentation: ##############################################
#### - Delete a user
### - a mutation that creates a new user, always returns 
### access_token and refresh_tokens as cookies with httponly=True
#####################################################################
class DeleteUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username):
        try:
            user = User.objects.filter(username=username).first()
            user.delete()
        except Exception as e:
            return DeleteUser(success=None, error='Error happened during deleting the user!')
        return DeleteUser(success='User deleted successfully!', error=None)


####### Documentation: ##############################################
#### - Add a friend
### - a mutation that adds a friend to the user, always returns
### success and error return values fields
#####################################################################
class AddFriend(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        friend_username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, friend_username):
        # checking for user inside the database
        is_user_not_exist = not User.objects.filter(username=username).exists()
        if is_user_not_exist:
            return AddFriend(success=None, error='User not found!')
        user = User.objects.filter(username=username).first()

        # checking for friend inside the database
        is_friend_not_exist = not User.objects.filter(username=friend_username).exists()
        if is_friend_not_exist:
            return AddFriend(success=None, error='Friend not found!')
        
        # checking if the friendship is already established therefore no need to create a new one
        is_friendship_already_established = Friend.objects.filter(user=user, followed_by=User.objects.filter(username=friend_username).first()).exists()
        if is_friendship_already_established:
            return AddFriend(success=None, error='Friendship already established!')

        # the main logic of adding a friend
        try:
            friend_user = User.objects.filter(username=friend_username).first()
            Friend.objects.create(user=user, followed_by=friend_user)
            return AddFriend(success='Friend added successfully!', error=None)
        except Exception as e:
            return AddFriend(success=None, error='Error occured during adding the friend!')

####### Documentation: ##############################################
#### - Add a friend
### - a mutation that adds a friend to the user, always returns
### success and error return values fields
#####################################################################
class DeleteFriend(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        friend_username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, friend_username):

        # checking for user inside the database
        is_user_not_exist = not User.objects.filter(username=username).exists()
        if is_user_not_exist:
            return DeleteFriend(success=None, error='User not found!')
        user = User.objects.filter(username=username).first()

        # checking for friend inside the database
        is_friend_not_exist = not User.objects.filter(username=friend_username).exists()
        if is_friend_not_exist:
            return DeleteFriend(success=None, error='Friend not found!')

        friend_user = User.objects.filter(username=friend_username).first()
        try:
            friendship_entity = Friend.objects.filter(user=user, followed_by=friend_user).first()
            friendship_entity.delete()
            return DeleteFriend(success='Friend deleted successfully!', error=None)
        except Exception as e:
            return DeleteFriend(success=None, error='Error occured during deleting the friend!')

####### Documentation: ##############################################
#### - Add a notification
### - a mutation that adds a notification to the user, always returns
### success and error return values fields
#####################################################################
class AddNotification(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        message = graphene.String(required=True)
        is_read = graphene.Boolean()

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, message, is_read=False):
        # checking for user inside the database
        is_user_not_exist = not User.objects.filter(username=username).exists()
        if is_user_not_exist:
            return AddNotification(success=None, error='User not found!')
        user = User.objects.filter(username=username).first()

        try:
            notif = Notification.create(message=message, is_read=is_read, user=user)
            return AddNotification(success='Notification added successfully!', error=None)            
        except Exception as e:
            return AddNotification(success=None, error='Error occured during adding the notification!')

####### Documentation: ##############################################
#### - Delete a notification
### - a mutation that deletes a notification from the user, always returns
### success and error return values fields
#####################################################################
class DeleteNotification(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, id):
        # checks by id for the notification
        try:
            notif = Notification.objects.filter(id=id).first()
            notif.delete()
            return DeleteNotification(success='Notification deleted successfully!', error=None)
        except Exception as e:
            return DeleteNotification(success=None, error='Error occured during deleting the notification!')

####### Documentation: ##############################################
#### - Update a notification
### - a mutation that updates a notification from the user, always returns
### success and error return values fields
#####################################################################
class UpdateNotification(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        message = graphene.String()
        is_read = graphene.Boolean()

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, id, message=None, is_read=None):
        try:
            notif = Notification.objects.filter(id=id).first()
            if message:
                notif.message = message
            if is_read:
                notif.is_read = is_read
            notif.save()
            return UpdateNotification(success='Notification updated successfully!', error=None)
        except Exception as e:
            return UpdateNotification(success=None, error='Error occured during updating the notification!')

####### Documentation: ##############################################
#### - Increment user points
### - a mutation that increments the user points, always returns
### success and error return values fields
#####################################################################
class IncrementUserPoints(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        points = graphene.Int(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, points):
        try:
            user = User.objects.filter(username=username).first()
            user.points_earned += points
            user.save()
            return IncrementUserPoints(success='Points updated successfully!', error=None)
        except Exception as e:
            return IncrementUserPoints(success=None, error='Error occured during incrementing the points!')

####### Documentation: ##############################################
#### - Increment user followers by +1
### - a mutation that increments the user followers, always returns
### success and error return values fields
#####################################################################
class IncrementNumberOfFollowers(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username):
        # increment the number of followers after checking if the user exists
        try:
            user = User.objects.filter(username=username).first()
            user.number_of_followers += 1
            user.save()
            return IncrementNumberOfFollowers(success='Number of followers updated successfully!', error=None)
        except Exception as e:
            return IncrementNumberOfFollowers(success=None, error='Error occured during incrementing the number of followers!')

####### Documentation: ##############################################
#### - Decrement user followers by -1
### - a mutation that decrements the user followers, always returns
### success and error return values fields
#####################################################################
class DecrementNumberOfFollowers(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username):
        # decrement the number of followers after checking if the user exists
        try:
            user = User.objects.filter(username=username).first()
            user.number_of_followers -= 1
            user.save()
            return DecrementNumberOfFollowers(success='Number of followers updated successfully!', error=None)
        except Exception as e:
            return DecrementNumberOfFollowers(success=None, error='Error occured during decrementing the number of followers!')

####### Documentation: ##############################################
#### - Set user online
### - a mutation that sets the user online, always returns
### success and error return values fields
#####################################################################
class SetUserOnline(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username):
        try:
            user = User.objects.filter(username=username).first()
            user.is_online = True
            user.save()
            return SetUserOnline(success='User is online!', error=None)
        except Exception as e:
            return SetUserOnline(success=None, error='Error occured during setting the user online!')

####### Documentation: ##############################################
#### - Set user offline
### - a mutation that sets the user offline, always returns
### success and error return values fields
#####################################################################
class SetUserOffline(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username):
        try:
            user = User.objects.filter(username=username).first()
            user.is_online = False
            user.save()
            return SetUserOffline(success='User is offline!', error=None)
        except Exception as e:
            return SetUserOffline(success=None, error='Error occured during setting the user offline!')

####### Documentation: ##############################################
#### - Set user playing
### - a mutation that sets the user playing, always returns
### success and error return values fields
#####################################################################
class SetUserPlaying(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username):
        try:
            user = User.objects.filter(username=username).first()
            user.is_playing = True
            user.save()
            return SetUserPlaying(success='User is playing!', error=None)
        except Exception as e:
            return SetUserPlaying(success=None, error='Error occured during setting the user playing!')

####### Documentation: ##############################################
#### - Set user not playing
### - a mutation that sets the user not playing, always returns
### success and error return values fields
#####################################################################
class SetUserNotPlaying(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username):
        try:
            user = User.objects.filter(username=username).first()
            user.is_playing = False
            user.save()
            return SetUserNotPlaying(success='User is not playing!', error=None)
        except Exception as e:
            return SetUserNotPlaying(success=None, error='Error occured during setting the user not playing!')

####### Documentation: ##############################################
#### - Mutation class
### - a class that contains all the mutations
#####################################################################

class Mutation(ObjectType):
    # for creating a new user
    create_user = CreateUser.Field()

    # for updating a user (for settings page)
    update_user = UpdateUser.Field()

    # increment user points
    increment_user_points = IncrementUserPoints.Field()

    # set the user as online
    set_user_online = SetUserOnline.Field()

    # set the user as offline
    set_user_offline = SetUserOffline.Field()

    # set the user as playing
    set_user_playing = SetUserPlaying.Field()

    # set the user as not playing
    set_user_not_playing = SetUserNotPlaying.Field()

    # increment number of followers
    increment_number_of_followers = IncrementNumberOfFollowers.Field()

    # decrement number of followers
    decrement_number_of_followers = DecrementNumberOfFollowers.Field()

    # delete user if needed
    delete_user = DeleteUser.Field()

    # add a friend to the user
    add_friend = AddFriend.Field()

    # delete a friend from the user
    delete_friend = DeleteFriend.Field()

    # add a notification to the user
    add_notification = AddNotification.Field()

    # delete a notification from the user
    delete_notification = DeleteNotification.Field()

    # update a notification from the user
    update_notification = UpdateNotification.Field()
