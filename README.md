# Music Discovery App

A web application for discovering new music artists using the MusicBrainz API.

## Features

- Search for artists by name
- Find similar artists by genre
- Browse artist albums and tracks
- Modern, responsive UI

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: 
  - Production: Netlify Functions (serverless)
  - Local Development: Express.js (optional)
- **API**: MusicBrainz API
- **Testing**: Jest, Supertest

## Quick Start

### Local Development (Express Server)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Local Development (Netlify Functions)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Start Netlify dev server
npm run dev:netlify
```

The app will be available at `http://localhost:8888`

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
│   ├── server.js          # Express server (local dev)
│   ├── routes/            # Express routes (local dev)
│   ├── services/          # Shared business logic
│   ├── config/            # Configuration
│   └── middleware/        # Express middleware
├── netlify/
│   └── functions/         # Netlify Functions (production)
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

- `npm start` - Start Express server
- `npm run dev` - Start Express server with auto-reload
- `npm run dev:netlify` - Start Netlify dev server
- `npm test` - Run tests

## License

ISC

