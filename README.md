# CertusBuild AU Planning App

Internal planning and resource management application for CertusBuild.

## Features

- Research Archive Management
- Pitch Materials Library
- Content Management Utilities
- User Authentication via Authentik SSO
- Docker Containerization

## Authentication Setup

This application uses Authentik as the identity provider for Single Sign-On (SSO). To set up authentication:

### 1. Configure Authentik Provider

In your Authentik admin panel:

1. Create a new OAuth2/OIDC Provider
   - Name: `CertusBuild Planning`
   - Slug: `certusbuild_planning`
   - Client Type: `Confidential`
   - Redirect URIs: `https://planning.certusbuild.com/auth/callback`
   - Signing Key: Select your preferred key or create a new one

2. Note the Client ID and Client Secret that Authentik generates

### 2. Set Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=production

# Session Configuration
SESSION_SECRET=replace_with_strong_secret_key

# Authentik Configuration
AUTH_CLIENT_ID=certusbuild_planning
AUTH_CLIENT_SECRET=replace_with_your_client_secret
AUTH_ISSUER=https://auth.rockcreekventures.com/application/o/certusbuild_planning/
AUTH_CALLBACK_URL=https://planning.certusbuild.com/auth/callback
AUTH_SCOPE=openid profile email

# Base URL for the app
BASE_URL=https://planning.certusbuild.com
```

Replace placeholder values with your actual secrets.

## Docker Deployment

The application can be deployed using Docker in two ways:

### Option 1: Nginx Reverse Proxy

This option uses Nginx as a reverse proxy with SSL termination.

1. Create required directories:
   ```bash
   mkdir -p ./nginx/logs ./certbot/conf ./certbot/www
   ```

2. Deploy with Docker Compose:
   ```bash
   docker-compose -f docker-compose.nginx.yml up -d
   ```

3. Obtain SSL certificate:
   ```bash
   docker-compose -f docker-compose.nginx.yml run --rm certbot certonly --webroot -w /var/www/certbot -d planning.certusbuild.com --email your-email@example.com --agree-tos
   ```

### Option 2: Cloudflare Tunnel

This option uses Cloudflare Tunnel for secure access.

1. Create Cloudflare Tunnel:
   - In Cloudflare Zero Trust dashboard, create a new tunnel
   - Download the credentials file and save it as `cloudflare/credentials.json`
   - Note the Tunnel ID

2. Set the Tunnel ID in your environment or `.env` file:
   ```
   CLOUDFLARE_TUNNEL_ID=your-tunnel-id
   ```

3. Deploy with Docker Compose:
   ```bash
   docker-compose -f docker-compose.cloudflare.yml up -d
   ```

## Development

To run the application locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## File Structure

- `/public` - Static assets and content files
- `/routes` - Application route handlers
- `/utils` - Utility functions and middleware
- `/views` - EJS templates and layouts
- `/nginx` - Nginx configuration for reverse proxy
- `/cloudflare` - Cloudflare Tunnel configuration

## Content Management

Content folders are organized as follows:

- `/public/content/research` - Research documents and files
- `/public/content/pitch_materials` - Pitch materials and presentations
- `/public/content/announcements` - Announcements and notifications

Use the built-in utilities page to manage content files and announcements.