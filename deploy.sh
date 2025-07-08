#!/bin/bash

# Deploy script for funfact-simple app to Azure Web App
# This script packages and deploys the Node.js application

set -e

# Configuration
RESOURCE_GROUP="mau2-rg-workshop-weu-p"
WEB_APP_NAME="mau2-lwapp-funfact-weu-p"
ZIP_FILE="app-deploy.zip"

echo "Starting deployment of funfact-simple app..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo "Not logged in to Azure. Please run: az login"
    exit 1
fi

# Clean up any existing zip file
rm -f $ZIP_FILE

# Create deployment package
echo "Creating deployment package..."
zip -r $ZIP_FILE . \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "*.yml" \
    -x "deploy.sh" \
    -x "*.md" \
    -x ".github/*" \
    -x "app-deploy.zip"

# Deploy to Azure Web App
echo "Deploying to Azure Web App: $WEB_APP_NAME..."
az webapp deploy \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --src-path $ZIP_FILE \
    --type zip \
    --restart true

# Clean up
rm -f $ZIP_FILE

# Get the web app URL
WEBAPP_URL=$(az webapp show \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query defaultHostName -o tsv)

echo "Deployment completed!"
echo "Web App URL: https://$WEBAPP_URL"

# Test the deployment
echo "Testing the deployment..."
RESPONSE=$(curl -s "https://$WEBAPP_URL/api/funfact" || echo "Failed to connect")

if [[ $RESPONSE == *"fact"* ]]; then
    echo "API endpoint is working!"
    echo "Response: $RESPONSE"
else
    echo "API endpoint test failed or timed out"
    echo "Please check the deployment logs in Azure Portal"
fi

echo ""
echo "View logs with: az webapp log tail --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"