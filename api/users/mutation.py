import graphene
from graphene.types import ObjectType
from transcendence.db import users, in_users
from users.models import User, Notification, Followership
from transcendence.utils import hash_password, verify_password

####### Documentation: ##############################################
#### - Create a new user
### - a mutation that creates a new user, always returns 
### access_token and refresh_tokens as cookies with httponly=True
#####################################################################
class CreateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        avatar_url = graphene.String()

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, avatar_url):
        # find if the user already exists in the database User model or not
        is_user_not_exist = not User.objects.filter(username=username).exists()
        
        if is_user_not_exist:
            try:
                User.objects.create(username=username, avatar_url=avatar_url)
                return CreateUser(success="User created successfully", error=None)
            except Exception as e:
                return CreateUser(success=None, error="Error occured during creating the user!")
        return CreateUser(success=None, error="User already exists")

# ####### Documentation: ##############################################
# #### - Update a user
# ### - a mutation that updates a user, always returns 
# ### success and error return values fields
# #####################################################################
# class UpdateUser(graphene.Mutation):
#     class Arguments:
#         username = graphene.String(required=True)
#         new_username = graphene.String()
#         new_password = graphene.String()
#         new_first_name = graphene.String()
#         new_last_name = graphene.String()
#         new_email = graphene.String()

#     success = graphene.String()
#     error = graphene.String()

#     def mutate(self, info, username, new_username=None, new_password=None, new_first_name=None, new_last_name=None, new_email=None):

#         # each field provided will be updated
#         try: # try to update the user
#             user = User.objects.filter(username=username).first()
#             if new_username: # updating the username field
#                 user.username = new_username
#             if new_password: # updating the password field
#                 user.password = hash_password(new_password)
#             if new_first_name: # updating the first_name field
#                 user.first_name = new_first_name
#             if new_last_name: # updating the last_name field
#                 user.last_name = new_last_name
#             if new_email: # updating the email field
#                 user.email = new_email
#             user.save()
#             return UpdateUser(success='User updated successfully!', error=None)
#         except Exception as e: # user update failed because there is no user with the given username
#             return UpdateUser(success=None, error='Error occured during updating the user!')

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
#### - Add a followership
### - a mutation that adds a followership to the user, always returns
### success and error return values fields
#####################################################################
class AddFollowerhsip(graphene.Mutation):
    class Arguments:
        user = graphene.String(required=True)
        following = graphene.String(required=True)
        initial_relevancy_score = graphene.Int()
    
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, user, following, initial_relevancy_score=0):
        # checking for user inside the database
        is_user_not_exist = not User.objects.filter(username=user).exists()
        if is_user_not_exist:
            return AddFollowerhsip(success=None, error='User not found!')
        user = User.objects.filter(username=user).first()

        # checking for friend inside the database
        is_following_not_exist = not User.objects.filter(username=following).exists()
        if is_following_not_exist:
            return AddFollowerhsip(success=None, error='Following not found!')

        # checking if the friendship is already established therefore no need to create a new one
        is_followership_already_established = Followership.objects.filter(user=user, following=User.objects.filter(username=following).first()).exists()
        if is_followership_already_established:
            return AddFollowerhsip(success=None, error='Followership already established!')

        # the main logic of adding a friend
        try:
            following_user = User.objects.filter(username=following).first()
            Followership.objects.create(user=user, following=following_user, relevancy_score=initial_relevancy_score)
            return AddFollowerhsip(success='Followership added successfully!', error=None)
        except Exception as e:
            return AddFollowerhsip(success=None, error='Error occured during adding the followership!')

####### Documentation: ##############################################
#### - Deletes a followership
### - a mutation that deletes a followership to the user, always returns
### success and error return values fields
#####################################################################
class DeleteFollowership(graphene.Mutation):
    class Arguments:
        user = graphene.String(required=True)
        following = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()
    def mutate(self, info, user, following):
        # checking for user inside the database
        is_user_not_exist = not User.objects.filter(username=user).exists()
        if is_user_not_exist:
            return DeleteFollowership(success=None, error='User not found!')
        user = User.objects.filter(username=user).first()

        # checking for friend inside the database
        is_following_not_exist = not User.objects.filter(username=following).exists()
        if is_following_not_exist:
            return DeleteFollowership(success=None, error='Following not found!')

        following_user = User.objects.filter(username=following).first()
        try:
            followership_entity = Followership.objects.filter(user=user, following=following_user).first()
            followership_entity.delete()
            return DeleteFollowership(success='Followership deleted successfully!', error=None)
        except Exception as e:
            return DeleteFollowership(success=None, error='Error occured during deleting the followership!')    

####### Documentation: ##############################################
#### - Set notification as read
### - a mutation that sets the notification as read, always returns
### success and error return values fields
#####################################################################
class SetNotificationAsRead(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, id):
        try:
            notif = Notification.objects.filter(id=id).first()
            notif.is_read = True
            notif.save()
            return SetNotificationAsRead(success='Notification is read!', error=None)
        except Exception as e:
            return SetNotificationAsRead(success=None, error='Error occured during setting the notification as read!')

##### Documentation: ##############################################
#### - Adds a notification to the datbase
### - a mutation that adds a new notification to the database, always
### returns success and error return values fields
#####################################################################
class AddNotification(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        message = graphene.String(required=True)
        is_read = graphene.Boolean() # optional argument

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, message, is_read):
        try:
            user = User.objects.filter(username=username).first()
            notif = Notification.create(message=message, is_read=False if not is_read else True, user=user)
            return AddNotification(success='Notification added successfully!', error=None)
        except Exception as e:
            return AddNotification(success=None, error='Error occured during adding the notification!')

##### Documentation: ##############################################
#### - Deletes a notification from the database
### - a mutation that deletes a notification from the database, always
### returns success and error return values fields
#####################################################################
class DeleteNotification(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    success = graphene.String()
    error = graphene.String()
    def mutate(self, info, id):
        try:
            notif = Notification.objects.filter(id=id).first()
            notif.delete()
            return DeleteNotification(success='Notification deleted successfully!', error=None)
        except Exception as e:
            return DeleteNotification(success=None, error='Error occured during deleting the notification!')

##### Documentation: ##############################################
#### - Set user avatar
### - a mutation that sets the user avatar, always
### returns success and error return values fields
#####################################################################
        
class UpdateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        avatar_url = graphene.String(required=True)

    success = graphene.String()
    error = graphene.String()

    def mutate(self, info, username, avatar_url):
        try:
            user = User.objects.filter(username=username).first()
            user.avatar_url = avatar_url
            user.save()
            return UpdateUser(success='User updated successfully!', error=None)
        except Exception as e:
            return UpdateUser(success=None, error='Error occured during updating the user!')


####### Documentation: ##############################################
#### - Mutation class
### - a class that contains all the mutations
#####################################################################

class Mutation(ObjectType):
    # for creating a new user
    create_user = CreateUser.Field()

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

    # delete user if needed
    delete_user = DeleteUser.Field()

    # update user avatar
    update_user = UpdateUser.Field()

    ##############################################
    ### Followership mutations
    ##############################################

    # add a followership
    add_followership = AddFollowerhsip.Field()

    # delete a followership
    delete_followership = DeleteFollowership.Field()

    ##############################################
    ### Notifications mutations
    ##############################################

    # add a notification to the user
    add_notification = AddNotification.Field()

    # delete a notification from the user
    delete_notification = DeleteNotification.Field()

    # set notifiction as read
    set_notification_as_read = SetNotificationAsRead.Field()