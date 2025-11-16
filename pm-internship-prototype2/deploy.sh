#!/bin/bash

echo "Building and deploying PM Internship Prototype..."

# Build and start services
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "Deployment complete!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "Database: localhost:5432"
echo "Redis: localhost:6379"