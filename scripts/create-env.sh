#!/bin/bash

# Script to create environment-specific .env file
ENV_FILE=".env.${ENV}"

# Create .env file with environment-specific variables
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}" > $ENV_FILE

# Additional environment-specific variables can be added here