import requests
import jwt
import time
from datetime import datetime, timedelta, timezone
from .models import User
from transcendence.settings import JWT_SECRET_KEY
from transcendence.settings import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_USER_INFO_URL, GOOGLE_TOKEN_URL, INTRA42_CLIENT_ID, INTRA42_REDIRECT_URI, INTRA42_CLIENT_SECRET, INTRA42_TOKEN_URL, INTRA42_USER_INFO_URL


# used to limit the number of iterations to generate a unique username
MAX_NUMBER_OF_USERNAME_ITERATIONS = 20
AVRG_USERNAME_LENGTH = 8
ENCRYPTING_ALGORITHM = 'HS256'
MAX_JWT_TOKEN_EXPIRATION_TIME_IN_MINUTES = 15

# format the url for the consent page
def format_url(platform: str, 
               client_id: str, 
               client_secret: str, 
               redirect_uri: str,
               response_type: str,
               scope: str):
    if platform == 'intra42':
        url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}'
        return url
    return "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1c7045c749bc1b239426a0361cf6a126a73d9b834c86f13c7246689c949b2400&redirect_uri=http%3A%2F%2Flocalhost%3A4000&response_type=code&scope=public"


#####################################################################################################
# The following functions are used to generate and verify jwt tokens for the users
#####################################################################################################

# to generate the access token for a user with jwt token, returns the jwt token if the token is successfully generated, None otherwise
def generate_jwt_access_token(username: str) -> str:
    payload = {
        'username': username,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=MAX_JWT_TOKEN_EXPIRATION_TIME_IN_MINUTES),
    }
    try:
        jwt_token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=ENCRYPTING_ALGORITHM)
    except Exception as e: # if an exception is raised, return None
        return None
    return jwt_token

# to verify the access token of a user, returns True if the access token is valid, False otherwise
def verify_access_token(access_token: str) -> bool:
    try:
        jwt.decode(access_token, JWT_SECRET_KEY, algorithms=[ENCRYPTING_ALGORITHM])
    except Exception as e:
        return False
    return True

#####################################################################################################
# The following functions are used to check if a username is already taken in the database
#####################################################################################################

# checks if user is already in the database for google, returns True if the user is already in the database, False otherwise
def check_is_pair_identifier_in_db(first_name: str, last_name: str) -> bool:
    if User.objects.filter(first_name=first_name, last_name=last_name).exists():
        return True
    return False

# checks if user is already in the database for intra42, returns True if the user is already in the database, False otherwise
def check_is_username_in_db(username: str) -> bool:
    print('BEFORE CHECKING')
    if User.objects.filter(username=username).exists():
        print('AFTER CHECKING TRUE')
        return True
    print('AFTER CHECKING FALSE')
    return False

#####################################################################################################
### OAuth2.0 functions to register a user in the database for Google
#####################################################################################################

# generates a unique username for a user for google
def generate_username_for_google(first_name, last_name):
    if not first_name or not last_name:
        return None
    counter = 1
    username = first_name.lower() + last_name.lower()
    username = username.replace(' ', '')  # remove spaces from the username
    username = username[:AVRG_USERNAME_LENGTH]  # limit the length of the username to 8 characters
    while check_is_username_in_db(username) and counter < MAX_NUMBER_OF_USERNAME_ITERATIONS:
        if counter == 1:
            username = username[:AVRG_USERNAME_LENGTH]  # reduce the length of the username to accommodate the number
        else:
            username = username[:-1]  # remove the last character (number) from the username
        username += str(counter)  # add a number to the end of the username
        counter += 1
    if counter == MAX_NUMBER_OF_USERNAME_ITERATIONS:
        return None
    return username

# generate the access token for a user for google, exchanges the code for access token
def generate_access_token_for_google(code: str) -> str:
    data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': 'http://localhost/auth/google',
        'grant_type': 'authorization_code'
    }
    response = requests.post(GOOGLE_TOKEN_URL, data=data)
    print(response.json())
    print('GOOGLE RESPONDED WITH => ', response.status_code)
    if response.status_code != 200: # if the response is not 200, return None
        return None
    response = response.json()
    print(response)
    if 'access_token' not in response: # if the access token is not in the response, return None
        return None
    return response['access_token']

# to register the user in the database with google, returns the jwt access token if the user is successfully registered, None otherwise
def register_user_google(access_token: str) -> bool:
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(GOOGLE_USER_INFO_URL, headers=headers)
    if response.status_code != 200: # if the response is not 200, return None
        return None
    response = response.json()
    if 'given_name' not in response or 'family_name' not in response or 'picture' not in response: # if the login is not in the response, return None
        return None

    avatar_url = response['picture']
    # if the user is already in the database, return jwt access token
    if check_is_pair_identifier_in_db(response['given_name'], response['family_name']): 
        username = User.objects.get(first_name=response['given_name'], last_name=response['family_name']).username
        jwt_access_token = generate_jwt_access_token(username)
        return jwt_access_token
    
    # if the user is not in the database, register the user in the database
    username = generate_username_for_google(response['given_name'], response['family_name'])
    try:
        user = User.objects.create(username=username, nickname=username, avatar_url=avatar_url, first_name=response['given_name'], last_name=response['family_name'], oauth2_platform='google')
        jwt_access_token = generate_jwt_access_token(username)
        return jwt_access_token
    except Exception as e:
        return None

#####################################################################################################
### OAuth2.0 functions to register a user in the database for Intra42
#####################################################################################################

# generate a unique username for a user for intra42
def generate_username_for_intra42(login: str) -> str:
    counter = 1
    username = login
    while check_is_username_in_db(username) and counter < MAX_NUMBER_OF_USERNAME_ITERATIONS:
        if counter == 1:
            username = username[:AVRG_USERNAME_LENGTH]  # reduce the length of the username to accommodate the number
        else:
            username = username[:-1]  # remove the last character (number) from the username
        username += str(counter)  # add a number to the end of the username
        counter += 1
    if counter == MAX_NUMBER_OF_USERNAME_ITERATIONS: # if we reach the maximum number of iterations, return None
        return None
    return username

# generate the access token for a user for intra42, exchanges the code for access token
def generate_access_token_for_intra42(code: str) -> str:
    data = {
        'grant_type': 'authorization_code',
        'client_id': 'u-s4t2ud-b6b88edd4d4f5119f7dddb97ea26fe24cd2430e7649bc5416d377099689575ca',
        'client_secret': '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',
        'code': code,
        'redirect_uri': 'http://localhost/auth/intra42',
    }
    token_url = 'https://api.intra.42.fr/oauth/token'
    response = requests.post(token_url, data=data)
    print(response.status_code)
    if response.status_code != 200: # if the response is not 200, return None
        print('Response is not 200')
        return None
    try:
        response = response.json()
    except Exception as e:
        print('EXCEPTION => ', e)
    if 'access_token' not in response: # if the access token is not in the response, return None
        return None
    return response['access_token']

# to register the user in the database with intra42, returns the jwt access token if the user is successfully registered, None otherwise
def register_user_intra42(access_token: str) -> bool:
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    print('AccessToken => ', access_token)
    response = requests.get('https://api.intra.42.fr/v2/me/', headers=headers)
    print(response.status_code)
    if response.status_code != 200: # if the response is not 200, return None
        return None
    response = response.json()
    print(response)
    if 'login' not in response or 'image' not in response: # if the login is not in the response, return None
        return None
    username = response['login']
    avatar_url = response['image']['link']
    print('Username => ', username)
    print('AvatarUrl => ', avatar_url)
    # if the user is already in the database, return jwt access token
    if check_is_username_in_db(username):
        print('YES USERNAME IS IN DB')
        jwt_access_token = generate_jwt_access_token(username)
        return jwt_access_token

    # if the user is not in the database, register the user in the database
    try:
        user = User.objects.create(username=username, nickname=username, avatar_url=avatar_url, oauth2_platform='intra42')
        jwt_access_token = generate_jwt_access_token(username)
        return jwt_access_token
    except Exception as e:
        return None

#####################################################################################################
### JWT functions for authentication and authorization
#####################################################################################################


# to check if the access token is valid, returns True if the access token is valid, False otherwise
def is_token_valid(access_token: str) -> bool:
    try:
        decoded_token = jwt.decode(access_token, JWT_SECRET_KEY, algorithms=[ENCRYPTING_ALGORITHM])
        
        expiration_time = decoded_token.get("exp")
        if expiration_time:
            current_time = int(time.time())
            if current_time > expiration_time:
                print("Access token has expired")
                return False
        
        # Additional checks can be performed here if needed
        
        print("Access token is valid")
        return True
    
    except jwt.ExpiredSignatureError:
        print("Access token has expired")
        return False
    except jwt.InvalidTokenError:
        print("Invalid access token")
        return False

# takes an access token and returns the username if the token is valid, None otherwise
def get_username_from_token(access_token: str) -> str:
    try:
        decoded_token = jwt.decode(access_token, JWT_SECRET_KEY, algorithms=[ENCRYPTING_ALGORITHM])
        username = decoded_token.get("username")
        if not username:
            return None
        return username
    except Exception as e:
        return None

def is_token_expired(access_token: str) -> bool:
    try:
        decoded_token = jwt.decode(access_token, JWT_SECRET_KEY, algorithms=[ENCRYPTING_ALGORITHM])
        expiration_time = decoded_token.get("exp")
        if expiration_time:
            current_time = int(time.time())
            if current_time > expiration_time:
                return True
        return False
    except jwt.ExpiredSignatureError:
        return True
    except jwt.InvalidTokenError:
        return False
    return False