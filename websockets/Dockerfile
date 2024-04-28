# Use the official Python image
FROM python:3.12.2-slim-bullseye

# Set the working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy the requirements file
COPY requirements.txt .

# Install the dependencies
RUN pip install --upgrade pip && \
	pip install -r requirements.txt

# Run the start script on container startup
CMD ["sh", "/app/start.sh"]
