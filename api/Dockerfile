FROM python:3.12.2-slim-bullseye

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# COPY manage.py /app/manage.py
# COPY games /app/games
# COPY tournaments /app/tournaments
# COPY users /app/users
# COPY transcendence /app/transcendence
# COPY start.sh /app/start.sh
COPY requirements.txt .

RUN pip install --upgrade pip && \
	pip install -r requirements.txt

# COPY . .

CMD ["sh", "/app/start.sh"]
