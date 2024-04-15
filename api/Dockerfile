FROM python:3.9.19-slim-bullseye

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
COPY start.sh /app/start.sh

COPY manage.py /app/manage.py
COPY venv /app/venv
COPY games /app/games
COPY tournaments /app/tournaments
COPY users /app/users
COPY transcendence /app/transcendence

RUN pip install --upgrade pip && \
	pip install -r requirements.txt && \
	rm requirements.txt

# COPY . .

CMD ["sh", "/app/start.sh"]
