from django.http import JsonResponse
from django.conf import settings
from jwt import decode, ExpiredSignatureError
from datetime import datetime, timedelta
from graphene_django.views import GraphQLView
from users.utils import verify_access_token, is_token_expired, generate_jwt_access_token

# from authentication.utils import verify_token, generate_access_token, TOKEN_INVALID, TOKEN_EXPIRED

####### DOCUMENTATION: #########################################################
### - This middleware is used to protect the /graphql endpoint               ###
###                                                                          ###
### - It checks if the access_token and refresh_token are valid              ###
###                                                                          ###
### note that after the token has been expired the frontend has to invoke    ###
### the sign_out mutation                                                    ###
################################################################################
class GraphQLAuthorizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        requested_url = request.path
        # if requested_url == '/api/graphql' or requested_url == '/api/graphql/':
        #     authorization_field = request.headers.get('Authorization') # getting the access token from the request
        #     if not authorization_field:
        #         return JsonResponse({'error': 'No authorization found'}, status=401)
        #     split_authorization_field = authorization_field.split(' ')
        #     if len(split_authorization_field) != 2:
        #         return JsonResponse({'error': 'Authorization does not have 2 parts'}, status=401)

        #     bearer = split_authorization_field[0]
        #     token = split_authorization_field[1]

        #     if bearer.lower() != 'bearer':
        #         return JsonResponse({'error': 'Authorization does not have Bearer'}, status=401)

        #     is_token_valid = verify_access_token(token)
        #     if not is_token_valid:
        #         return JsonResponse({'error': 'Invalid access token'}, status=401)

        response = self.get_response(request)
        return response


class GraphQLProtectedResource:
    def __init__(self, func):
        self.func = func

    def __call__(self, *args, **kwargs):
        request = args[0]
        requested_url = request.path
        is_refresh_token_not_exist = False if request.COOKIES.get('refresh_token') else True

        # if the refresh token is not provided in the request
        if is_refresh_token_not_exist:
            return JsonResponse({'error': 'No refresh token found'}, status=401)

        # if the refresh token is invalid        
        if not verify_access_token(request.COOKIES.get('refresh_token')):
            return JsonResponse({'error': 'Invalid refresh token'}, status=401)

        if requested_url == '/api/graphql' or requested_url == '/api/graphql/':
            authorization_field = request.headers.get('Authorization')
            if not authorization_field:
                return JsonResponse({'error': 'No authorization found'}, status=401)
            split_authorization_field = authorization_field.split(' ')
            if len(split_authorization_field) != 2:
                return JsonResponse({'error': 'Authorization does not have 2 parts'}, status=401)
            bearer = split_authorization_field[0]
            token = split_authorization_field[1]

            if bearer.lower() != 'bearer':
                return JsonResponse({'error': 'Authorization does not have Bearer'}, status=401)
            
            is_token_valid = verify_access_token(token)
            if not is_token_valid:
                return JsonResponse({'error': 'Invalid access token'}, status=401)
        return self.func(*args, **kwargs)

####### DOCUMENTATION: ############################################################################
### - This is a customize GraphQLView user mainly to set cookies                                ###
### - The idea is you cannot consume the /graphql api unless you are authenticated              ###
###  therefore the access_token and refresh_token will always be sent as cookies                ###
###                                                                                             ###
###  Authentication Flow Explained:                                                             ###
###   1. The user logs in and the server sends back the access_token and                        ###
###   refresh_token                                                                             ###
###   2. The user sends the access_token and refresh_token as cookies in the request            ###
###   3. The server checks if the access_token and refresh_token are valid                      ###
###   4. If the access_token is expired, the server generates a new access_token                ###
###   5. The server sends back the new access_token and refresh_token as cookies                ###
###                                                                                             ###
### This customized graphql view is only used to set the cookies in the response                ###
### because the mutation cannot set explicit cookies in the response therefore this             ###
### view communicates with it using the request.access_token field                              ###
###                                                                                             ###
### Once the request.access_token is set, a new cookie will be set with that name               ###
### therefore, the frontned should keep sending verify_token mutation request to the backend    ###
### threfore that field can be set, and the cookies will be updated accordingly.                ###
###################################################################################################
class MyGraphQLView(GraphQLView):
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)        
        refresh_token = request.COOKIES.get('refresh_token')

        # checking if the the user has signed out or the refresh token is invalid
        if not refresh_token or (hasattr(request, 'user_signed_out') and request.user_signed_out is True) or not verify_access_token(refresh_token):
            response.delete_cookie('refresh_token')

        # if the refresh token is exist at the request then set it as a cookie
        if hasattr(request, 'refresh_token'):
            response.set_cookie('refresh_token', request['refresh_token'], httponly=True, secure=True, expires=datetime.now() + timedelta(days=30))

        return response
