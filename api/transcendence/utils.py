import bcrypt
import requests
from transcendence.settings import SUPPORTED_OAUTH2_PLATFORMS, INTRA42_CLIENT_ID, INTRA42_CLIENT_SECRET, HTTP_BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from users.models import User

INVALID_PLATFORM = 'Invalid platform'
USER_ALREADY_EXIST = 'User already exists!'
SUCCESS = 'Success'
FAILURE = 'Failed'

# a function to hash the password
def hash_password(password: str) -> any:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# a function to verify the password returns a boolean
def verify_password(hashed_password: str, password: str) -> any:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

# a function that returns the redirection url for oauth2
def get_redirection_url_for_oauth2(platform: str) -> str:
    lower_platform = platform.lower()
    base_url = ''
    query_params = None

    # if the platform is not supported by the server 
    if lower_platform not in SUPPORTED_OAUTH2_PLATFORMS:
        return INVALID_PLATFORM

    if lower_platform == 'google':
        base_url = 'https://accounts.google.com/o/oauth2/v2/auth'
        query_params = {
            'client_id': GOOGLE_CLIENT_ID,
            'redirect_uri': HTTP_BASE_URL + '/oauth2/google/callback',
            'response_type': 'code',
            'scope': 'public',
        }
    elif lower_platform == 'intra42':
        base_url = 'https://api.intra.42.fr/oauth/authorize'
        query_params = {
            'client_id': INTRA42_CLIENT_ID,
            'redirect_uri': HTTP_BASE_URL + '/oauth2/intra42/callback',
            'response_type': 'code',
            'scope': 'public',
        }
    
    url = base_url + '?' + '&'.join([f'{key}={value}' for key, value in query_params.items()]) 
    return url

# a function that registers the user from intra42
def register_user_from_intra42(access_token: str) -> bool:
    api_url = 'https://api.intra.42.fr/v2/me'
    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    # Perform GET request to retrieve user profile data
    response = requests.get(api_url, headers=headers)
    # Check if request was successful (status code 200)
    if response.status_code == 200:
        # Parse JSON response
        profile_data = response.json()
        # # Extract profile information
        profile_picture_url = profile_data['image']['link']
        username = profile_data['login']
        first_name = profile_data['first_name']
        last_name = profile_data['last_name']
        email = profile_data['email']

        # create a user with the profile information
        try:
            if User.objects.filter(username=username).exists():
                return USER_ALREADY_EXIST
            User.objects.create(username=username, first_name=first_name, last_name=last_name, email=email)
            return SUCCESS 
        except Exception as e:
            return FAILURE
    return FAILURE