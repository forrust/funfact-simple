# Funfact Simple App

A simple Node.js web application that displays random fun facts. This app is designed to be deployed on Azure Web Apps.

## Features

- Random Fun Facts: Displays interesting technology and science facts
- REST API: Exposes `/api/funfact` endpoint for programmatic access
- Responsive Design: Works on desktop and mobile devices
- Azure-Ready: Optimized for Azure Web App deployment
- SSH Access: Enabled for debugging and monitoring

## Architecture

```
Web Browser ----> Express.js Application
                       |
                       +-- Static Files (HTML, CSS, JS)
                       |
                       +-- API Endpoint (/api/funfact)
```

## Project Structure

```
funfact-simple/
├── app.js              # Express server and API endpoints
├── index.html          # Frontend HTML
├── script.js           # Frontend JavaScript
├── style.css           # Styling
├── funfacts.js         # Fun facts data
├── package.json        # Node.js dependencies
├── package-lock.json   # Dependency lock file
├── azure-pipelines-app.yml  # Azure DevOps pipeline
└── README.md           # This file
```

## Getting Started

### Prerequisites
- Node.js 20.x or later
- npm (comes with Node.js)

### Local Development

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd funfact-simple
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the application
   ```bash
   npm start
   ```

4. Access the application
   - Web UI: http://localhost:3001
   - API: http://localhost:3001/api/funfact

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port number for the server | 3001 |

## API Documentation

### Get Random Fun Fact
```
GET /api/funfact
```

Response:
```json
{
  "funfact": "The first computer bug was an actual bug - a moth trapped in Harvard's Mark II computer in 1947."
}
```

Example using curl:
```bash
curl http://localhost:3001/api/funfact
```

## Deployment

### Azure Web App Deployment

This app is configured to run on Azure Linux Web Apps with Node.js 20 LTS.

#### Quick Deploy with Azure CLI
```bash
# Create a deployment package
zip -r deploy.zip . -x "node_modules/*" ".git/*"

# Deploy to Azure Web App
az webapp deployment source config-zip \
  --resource-group <resource-group-name> \
  --name <web-app-name> \
  --src deploy.zip
```

#### CI/CD with Azure DevOps

The project includes `azure-pipelines-app.yml` for automated deployment:

1. Pipeline Features:
   - Automatic trigger on main branch
   - Node.js 20.x build environment
   - Automated testing (when tests are added)
   - Zero-downtime deployment
   - Post-deployment verification

2. Required Variables:
   - webAppName: Your Azure Web App name
   - resourceGroup: Azure resource group name

### Deployment Checklist

- Node.js 20 LTS runtime configured
- Port configuration via environment variable
- Static file serving configured
- API endpoints tested
- Azure DevOps pipeline ready

## Development

### Adding New Fun Facts

Edit `funfacts.js` and add new facts to the array:
```javascript
module.exports = [
  "Your new fun fact here!",
  // ... more facts
];
```

### Modifying the UI

- HTML: Edit `index.html`
- Styles: Modify `style.css`
- Behavior: Update `script.js`

### Project Scripts

```json
{
  "start": "node app.js"
}
```

## Security Considerations

- No sensitive data in code
- Environment variables for configuration
- HTTPS enforced in production (via Azure)
- No database credentials (uses in-memory data)

## Debugging

### Local Debugging
```bash
# Run with Node.js inspector
node --inspect app.js
```

### Production Debugging (SSH)
After deployment to Azure:
```bash
# SSH into the web app
az webapp ssh --name <app-name> --resource-group <rg-name>

# Navigate to app directory
cd /home/site/wwwroot

# View logs
cd /home/LogFiles
```

## Monitoring

When deployed to Azure:
- Application Logs: Azure Portal > App Service > Log Stream
- Metrics: Azure Portal > App Service > Metrics
- Health Check: Configure in Azure Portal

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process or use different port
PORT=3002 npm start
```

**Module Not Found**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Azure Deployment Fails**
- Check Node.js version matches (20.x)
- Verify all files are included in deployment
- Check Azure Portal logs for errors

## Support

For issues or questions:
- Check Azure Portal diagnostics
- Review deployment logs
- Contact: dsp-azureservices@kpn.com