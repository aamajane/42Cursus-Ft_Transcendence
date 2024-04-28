#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Starting Daphne development server at port 8001..."
python manage.py runserver 0.0.0.0:8001
