#!/bin/bash
# Start the travel buddy matcher server

echo "Starting Travel Buddy Matcher Server..."

# Set environment variables
export NODE_ENV=development

# Start the server
node src/server.js