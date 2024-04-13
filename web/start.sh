#!/bin/sh

cd ./backend

echo "Waiting for postgres..."
sleep 2

echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Creating superuser..."
export DJANGO_SUPERUSER_PASSWORD=${SUPERUSER_PASSWORD}
python manage.py createsuperuser --noinput --username=${SUPERUSER_USERNAME} --email=${SUPERUSER_EMAIL}

echo "Creating 4 test users..."
python manage.py shell <<EOF
from django.contrib.auth.models import User

# Create regular users
User.objects.create_user('user1', password='user1')
User.objects.create_user('user2', password='user2')
User.objects.create_user('user3', password='user3')
User.objects.create_user('user4', password='user4')

# Grant staff status to the test users
for username in ['user1', 'user2', 'user3', 'user4']:
    user = User.objects.get(username=username)
    user.is_staff = True
    user.save()
EOF

echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
