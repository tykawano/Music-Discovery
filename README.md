# Music Discovery App

A web application for discovering new music artists using the MusicBrainz API.

## Features

- Search for artists by name
- Find similar artists by genre
- Browse artist albums and tracks
- Modern, responsive UI

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Netlify Functions (serverless) - used for both local development and production
- **API**: MusicBrainz API
- **Testing**: Jest

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

   This uses Netlify CLI to run your functions locally. The app will be available at `http://localhost:8888`

   **Note**: If you don't have Netlify CLI installed globally, install it first:
   ```bash
   npm install -g netlify-cli
   ```

### Running Tests

```bash
npm test
```

## Deployment

This project is configured for deployment on Netlify. See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Netlify will auto-detect settings from `netlify.toml`
4. Deploy!

## Project Structure

```
├── public/                 # Frontend static files
│   ├── index.html
│   ├── css/
│   └── js/
├── src/                    # Backend source code
│   ├── services/          # Shared business logic (used by Netlify Functions)
│   └── config/            # Configuration
├── netlify/
│   └── functions/         # Netlify Functions (used for local dev and production)
├── tests/                 # Test files
└── netlify.toml          # Netlify configuration
```

## API Endpoints

- `GET /api/search-artist?name={artist}` - Search for artists
- `GET /api/artist/:mbid` - Get artist details
- `GET /api/artist/:mbid/releases` - Get artist albums
- `GET /api/artist/:mbid/similar?genre={genre}` - Find similar artists
- `GET /api/release/:releaseId/recordings` - Get album tracks

## Scripts

- `npm run dev` - Start local development server with Netlify Functions (uses `netlify dev`)
- `npm test` - Run tests

## License

ISC

