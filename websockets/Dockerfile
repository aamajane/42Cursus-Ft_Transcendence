FROM python:3.12.2-slim-bullseye

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# COPY . .
COPY requirements.txt .

RUN pip install --upgrade pip && \
	pip install -r requirements.txt

CMD ["sh", "/app/start.sh"]
