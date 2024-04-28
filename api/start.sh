#!/bin/sh

DB_NAME=$POSTGRES_DB
DB_USER=$POSTGRES_USER
DB_PASSWORD=$POSTGRES_PASSWORD
DB_HOST=$POSTGRES_HOST
DB_PORT=$POSTGRES_PORT

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

echo "Applying database migrations..."
python3 manage.py makemigrations
python3 manage.py migrate

echo "Starting Django development server at port 8000..."
python3 manage.py runserver 0.0.0.0:8000
