from django.http import HttpResponse, JsonResponse
from users.utils import get_username_from_token, get_is_2fa_passed, generate_access_token_for_intra42, generate_jwt_access_token, verify_access_token, register_user_intra42, generate_access_token_for_google, register_user_google
from .settings import GOOGLE_CLIENT_ID, INTRA42_REDIRECT_URI
import json
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


######## Generates a qr code for the user ########################################
# restful api endpoint that generates a qr code for the user
# takes the username from the url, therefore it accepts GET requests only
##################################################################################
def generate_qr_code(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    authorization = request.headers.get('Authorization')
    access_token = authorization.split(' ')[1] if authorization else None

    if not access_token:
        return JsonResponse({'error': 'No token provided'}, status=400)

    is_2fa_passed = get_is_2fa_passed(access_token)
    if is_2fa_passed is None:
        return JsonResponse({'error': 'Invalid token!'}, status=400)

    uri = pyotp.totp.TOTP(key).provisioning_uri(name='ExtreamPong', issuer_name='ExtreamPong')
    filename = generate_random_filename()
    filepath = os.path.join('qr_codes', filename)
    try:
        qrcode.make(uri).save(filepath)
    except Exception as e:
        return JsonResponse({'error': 'Error occured during the QR code generation!'}, status=500)
    base_url = 'http://localhost/api/qr_code'
    url = f'{base_url}/{filename}'
    return JsonResponse({'url': url, 'success': 'QR code generated successfully!'}, status=200)


####### GET QR CODE FILE ####################################################
# restful api endpoint that returns the qr code file (image) for the user
# takes the filename from the url, therefore it accepts GET requests only
##################################################################################
def get_qr_code_file(request, filename):
    if request.method != 'GET':
        return HttpResponse(status=405)    

    filepath = os.path.join('qr_codes', filename)
    if not os.path.exists(filepath):
        return HttpResponse(status=404)
    with open(filepath, 'rb') as file:
        response = HttpResponse(file.read(), content_type='image/png')
        response['Content-Disposition'] = 'inline; filename=' + os.path.basename(filepath)
        return response

####### VERIFY THE 2FA CODE ####################################################
# restful api endpoint that verifies the 2fa code
# takes the code from the body of the request, therefore it accepts POST requests only
##################################################################################
def verify_2fa_code(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    body = json.loads(request.body)
    access_token = body.get('accessToken')
    username = get_username_from_token(access_token)
    if not username:
        return JsonResponse({'error': 'Invalid token!'}, status=400)

    code = body.get('code')
    if not code:
        return JsonResponse({'error': 'No code provided'}, status=400)

    totp = pyotp.TOTP(key)
    if not totp.verify(code):
        return JsonResponse({'error': 'Invalid code.'}, status=401)

    # 2fa_passed is set to True in this access token therefore the user will not be asked for 2fa code again
    # also the user will be able to access the GraphQL API with this token
    new_access_token = generate_jwt_access_token(username, False)
    return JsonResponse({'success': 'Code verified successfully!', 'accessToken': new_access_token}, status=200)

######### UPLOAD IMAGE ####################################################
# restful api endpoint that uploads an image for a user
# takes the image from the body of the request, therefore it accepts POST requests only
#
# NOT USED
##################################################################################
def upload_image(request, username):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        user = None
        try:
            user = User.objects.get(username=username)
        except Exception as e:
            return JsonResponse({'error': 'User not found', 'success': None})
        user.image = image_file
        user.save()
        return JsonResponse({'success': 'Image uploaded successfully', 'error': None})
    else:
        return JsonResponse({'error': 'No image file provided', 'success': None})
    

