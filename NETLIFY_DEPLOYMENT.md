# Netlify Deployment Guide

This project is configured to deploy to Netlify as a serverless application.

## Project Structure

- **Frontend**: Static files in `public/` directory
- **Backend (Production)**: Netlify Functions in `netlify/functions/` directory
- **Backend (Local Dev)**: Express server in `src/server.js` (optional, for local development)
- **Shared Services**: `src/services/` contains shared business logic used by both Express and Netlify Functions
- **Configuration**: `netlify.toml` contains build and redirect settings

### Note on Server Code

The Express server code (`src/server.js`, `src/routes/`, `src/middleware/`) is kept for:
- Local development and testing
- Running tests that require the Express server
- Flexibility to deploy to other platforms if needed

**For Netlify deployment**, only the files in `netlify/functions/` are used. The Express server code is not deployed to Netlify.

## Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add Netlify deployment configuration"
   git push
   ```

2. **Connect to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Deploy**:
   - Click "Deploy site"
   - Netlify will install dependencies and deploy your functions

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI** (if not installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and deploy**:
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Configuration

The `netlify.toml` file configures:
- **Publish directory**: `public` (your frontend)
- **Functions directory**: `netlify/functions` (your serverless API)
- **Node.js version**: 20
- **Redirects**: All `/api/*` requests are routed to Netlify Functions
- **SPA routing**: All other requests fallback to `index.html`

## API Endpoints

Your API endpoints will be available at:
- `https://your-site.netlify.app/api/search-artist`
- `https://your-site.netlify.app/api/artist/:mbid`
- `https://your-site.netlify.app/api/artist/:mbid/releases`
- `https://your-site.netlify.app/api/artist/:mbid/similar`
- `https://your-site.netlify.app/api/release/:releaseId/recordings`

## Local Development

You have two options for local development:

### Option 1: Express Server (Recommended for local dev)

This uses the traditional Express server setup:

```bash
npm run dev
```

- Serves static files and API routes
- Runs on `http://localhost:3000`
- Faster startup, easier debugging
- Matches the original development setup

### Option 2: Netlify Functions Locally

This simulates the Netlify environment locally:

1. **Install Netlify CLI** (if not installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Run Netlify dev server**:
   ```bash
   npm run dev:netlify
   # or
   netlify dev
   ```

   This will:
   - Serve your static files from `public/`
   - Run your Netlify Functions locally
   - Make `/api/*` endpoints available at `http://localhost:8888/api/*`
   - More closely matches production environment

## Functions

Each Netlify Function corresponds to an API endpoint:
- `netlify/functions/search-artist.js` - Search for artists
- `netlify/functions/artist.js` - Get artist details
- `netlify/functions/artist-releases.js` - Get artist releases
- `netlify/functions/artist-similar.js` - Find similar artists
- `netlify/functions/release-recordings.js` - Get release recordings

All functions include:
- CORS headers for cross-origin requests
- Error handling
- Proper HTTP status codes

## Environment Variables

Currently, no environment variables are required. The MusicBrainz API configuration is in `src/config/constants.js`.

If you need to add environment variables:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add your variables
3. Access them in functions via `process.env.VARIABLE_NAME`

## Troubleshooting

### Functions not working
- Check Netlify Function logs in the dashboard
- Verify `netlify.toml` redirects are correct
- Ensure Node.js version is 20+ (specified in `netlify.toml`)

### CORS errors
- All functions include CORS headers
- If issues persist, check browser console for specific errors

### Local development issues
- Make sure `netlify dev` is running if using Netlify Functions locally
- Or use `npm run dev` for Express server development

