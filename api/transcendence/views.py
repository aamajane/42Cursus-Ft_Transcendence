from django.http import HttpResponse, JsonResponse
from users.utils import get_username_from_token, get_is_2fa_passed, generate_access_token_for_intra42, generate_jwt_access_token, verify_access_token, register_user_intra42, generate_access_token_for_google, register_user_google
from .settings import GOOGLE_CLIENT_ID, INTRA42_REDIRECT_URI, MEDIA_ROOT
from django.core.files.storage import FileSystemStorage
import json
from users.models import User
from datetime import datetime, timedelta
import pyotp
import time
import qrcode
import uuid
import jwt
import os

key = "HichamElmefeddelApp"

def generate_random_filename(extension='png'):
    random_string = uuid.uuid4().hex
    return f"{random_string}.{extension}"

def root_view(request):
    return HttpResponse("Hello from API!")

########## INTRA42 CONSENT PAGE ########################################
# restful api endpoint that returns the consent page for intra42
##################################################################################
def intra42_consent(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    authorization_base_url = 'https://api.intra.42.fr/oauth/authorize'
    client_id = 'u-s4t2ud-b6b88edd4d4f5119f7dddb97ea26fe24cd2430e7649bc5416d377099689575ca'
    redirect_uri = 'http://localhost/auth/intra42'
    response_type = 'code'
    scopes = ['public', 'profile']
    scope = ' '.join(scopes)
    url = f'{authorization_base_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&scope={scope}'
    print(url)
    return JsonResponse({'url': url})

########## GOOGLE CONSENT PAGE ########################################
# restful api endpoint that returns the consent page for google
##################################################################################
def google_consent(request):
    authorization_base_url = 'https://accounts.google.com/o/oauth2/auth'
    params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': 'http://localhost/auth/google',
        'response_type': 'code',
        'scope': 'openid email profile',
    }
    url = authorization_base_url + '?' + '&'.join([f'{key}={value}' for key, value in params.items()])
    print(url)
    return JsonResponse({'url': url})


########## EXCHANGE CODE FOR ACCESS TOKEN ########################################
# restful api endpoint that exchanges the code for an access token
# takes the code from the body of the request, therefore it accepts POST requests only
##################################################################################
def intra42_exchange(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    body = json.loads(request.body)
    code = body['code']
    
    # if no code is provided
    if not code:
        return JsonResponse({'error': 'No code provided'}, status=400)

    access_token = generate_access_token_for_intra42(code)
    if not access_token: # error occured during the process of generating a token
        return JsonResponse({'error': 'Error occured during the token generation 1!'}, status=500)
    jwt_access_token = register_user_intra42(access_token)
    if not access_token: # error occured during the process of registering the user
        return JsonResponse({'error': 'Error occured during the user registration 2!'}, status=500)
    refresh_token = generate_jwt_access_token(code, False) # code passed to generate the refresh token (random string)
    response = JsonResponse({'token': jwt_access_token, 'success': 'Token generated successfully!'}, status=200)
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, expires=datetime.now() + timedelta(days=30))
    return response

########## EXCHANGE CODE FOR ACCESS TOKEN ########################################
# restful api endpoint that exchanges the code for an access token
# takes the code from the body of the request, therefore it accepts POST requests only
##################################################################################
def google_exchange(request):
        if request.method != 'POST':
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        body = json.loads(request.body)
        code = body['code']
    
        # if no code is provided
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)

        print('BEFORE GENERTING ACCESS TOKEN')
        access_token = generate_access_token_for_google(code)
        if not access_token: # error occured during the process of generating a token
            return JsonResponse({'error': 'Error occured during the token generation!'}, status=500)
        jwt_access_token = register_user_google(access_token)
        if not jwt_access_token: # error occured during the process of registering the user
            return JsonResponse({'error': 'Error occured during the user registration!'}, status=500)
        response = JsonResponse({'token': jwt_access_token, 'success': 'Token generated successfully!'}, status=200)
        refresh_token = generate_jwt_access_token(code, False) # code passed to generate the refresh token (random string)
        response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, expires=datetime.now() + timedelta(days=30))
        return response

######### VERIFY ACCESS TOKEN ####################################################
# restful api endpoint that verifies the access token
# takes the access token from the header of the request, therefore it accepts POST requests only
##################################################################################
def verify_token(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    body = json.loads(request.body)
    access_token = body.get('token')
    if not access_token:
        return JsonResponse({'error': 'No token provided'}, status=400)
    if not verify_access_token(access_token):
        return JsonResponse({'error': 'Invalid token!'}, status=401)
    return JsonResponse({'success': 'Token verified successfully!'}, status=200)



######### UPLOAD IMAGE ####################################################
## - restful api endpoint that uploads an image for a user
## takes the image from the body of the request, therefore it accepts POST requests only
##
## - takes the username to update the image for from the header of the request
##################################################################################
def upload_image(request, username):
    print('REQUEST => ', request.FILES)
    if request.method == 'POST' and request.FILES:
        if not username:
            return JsonResponse({'error': 'No username provided'}, status=400)
        user = User.objects.filter(username=username).first()
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)
        myfile = request.FILES['myfile']
        fs = FileSystemStorage(location=MEDIA_ROOT)
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = fs.url(filename)
        user.avatar_url = f'http://localhost/api/media{uploaded_file_url}'
        user.save()
        return JsonResponse({'success': True, 'url': uploaded_file_url})
    if not request.FILES:
        print('NO FILE UPLOADED')
    return JsonResponse({'success': False, 'error': 'No file uploaded'})

######### SERVE IMAGE ####################################################
## - restful api endpoint that serves an image for a user
## takes the image name from the header of the request
##################################################################################
def serve_image(request, image_file):
    if not image_file:
        return HttpResponse(status=404)
    fs = FileSystemStorage(location=MEDIA_ROOT)
    file = fs.open(image_file)
    return HttpResponse(file, content_type='image/png')
