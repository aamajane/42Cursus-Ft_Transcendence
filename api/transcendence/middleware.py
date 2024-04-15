from django.http import JsonResponse
from django.conf import settings
from jwt import decode, ExpiredSignatureError
from datetime import datetime, timedelta
from graphene_django.views import GraphQLView
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

        # # protecting the /graphql endpoint
        # if requested_url == '/graphql' or requested_url == '/graphql/':
        #     access_token = request.COOKIES.get('access_token') # getting the access token from the request
        #     refresh_token = request.COOKIES.get('refresh_token') # getting the refresh token from the request

        #     if access_token is not None or refresh_token is not None: # if the access_token or refresh_token is not in the request
        #         print('YES ACCESS TOKEN OR REFRESH TOKEN')
        #         access_token_status = verify_token(access_token) # verifying the access token
        #         refresh_token_status = verify_token(refresh_token) # verifying the refresh token

        #         if access_token_status == TOKEN_INVALID: # if access_token is invalid
        #             return JsonResponse({'error': 'Invalid access token'}, status=401)
                
        #         if refresh_token_status == TOKEN_INVALID: # if refresh_token is invalid
        #             return JsonResponse({'error': 'Invalid refresh token'}, status=401)

        #         if refresh_token_status == TOKEN_EXPIRED: # if refresh_token is expired
        #             return JsonResponse({'error': 'Expired refresh token'}, status=401)

        response = self.get_response(request)
        return response


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
        # access_token = request.COOKIES.get('access_token')
        # refresh_token = request.COOKIES.get('refresh_token')
        # access_token_status = verify_token(access_token)
        # refresh_token_status = verify_token(refresh_token)

        # # checking if the refresh_token is expired
        # if refresh_token_status == TOKEN_EXPIRED or (hasattr(request, 'user_signed_out') and request.user_signed_out == True):
        #     response.delete_cookie('access_token')
        #     response.delete_cookie('refresh_token')
        # else: # if the refresh_token is not expired
        #     print('REFRESH_TOKEN OR ACCESS_TOKEN IS NOT EXPIRED')
        #     if hasattr(request, 'access_token'): # if the access_token is expired then generate a new one
        #         response.set_cookie('access_token', request.access_token, httponly=True, expires=datetime.now() + timedelta(minutes=15))
        #     if hasattr(request, 'refresh_token'): # if the refresh_token is in the request then set the refresh_token cookie
        #         response.set_cookie('refresh_token', request.refresh_token, httponly=True, expires=datetime.now() + timedelta(days=30))
        return response
