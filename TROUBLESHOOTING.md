# CertusBuild App Troubleshooting Guide

## Authentication Issues

If you're having trouble with Authentik authentication, follow these steps:

### Using Authentication Bypass

For testing and initial deployment, you can bypass authentication:

1. Set `AUTH_BYPASS_ENABLED=true` in your `.env` file or Docker environment
2. This creates a dummy user session that bypasses Authentik
3. All protected routes will be accessible without authentication

### Authentik Integration

If you're encountering "Not Found" errors on the Authentik side:

1. **Verify Authentik Provider Configuration**:
   - Check that the application is registered in Authentik admin panel
   - Ensure the client ID matches what's in your environment variables
   - Verify that the redirect URI is exactly `https://planning.certusbuild.com/auth/callback`
   - Check that the correct scopes are assigned (`openid profile email`)

2. **Network Issues**:
   - Ensure your server can reach the Authentik server
   - Check for any firewall rules blocking traffic
   - Verify DNS resolution for both domains

3. **Endpoint Configuration**:
   - Confirm the issuer URL includes the trailing slash: `https://auth.rockcreekventures.com/application/o/certusbuild_planning/`
   - Verify OAuth endpoints (authorize, token, userinfo) are accessible

4. **Debugging OAuth Flow**:
   - Check browser developer tools for network requests
   - Look for failed API requests and error responses
   - Examine redirect chains to identify where the flow is breaking

## Redis Session Storage Issues

If you're experiencing Redis connection issues:

1. **Verify Redis Connection**:
   - Make sure Redis is running (`docker-compose ps`)
   - Check that the Redis URL is correct (`redis://redis:6379`)
   - Test Redis connection with `redis-cli`

2. **Compatibility Issues**:
   - CertusBuild uses connect-redis v6.1.3 with redis v3.1.2
   - If upgrading, ensure compatible versions are used
   - The app is configured to fall back to in-memory storage if Redis fails

3. **Docker Networking**:
   - Ensure the Redis container is in the same network as the app
   - Check that the Redis service name resolves correctly
   - Verify no port conflicts

## General Debugging

For other issues:

1. **Check Container Logs**:
   ```bash
   docker-compose logs cb-app
   ```

2. **Enter the Container for Debugging**:
   ```bash
   docker-compose exec cb-app /bin/sh
   ```

3. **Restart the Services**:
   ```bash
   docker-compose restart
   ```

4. **Rebuild from Scratch**:
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```