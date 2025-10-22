#!/bin/sh
# Wait for Postgres to be ready

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma db push --accept-data-loss

# Start the application
echo "Starting the application..."
exec "$@"
