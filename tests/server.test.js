const request = require('supertest');

// Mock the MusicBrainz service before importing the app
jest.mock('../src/services/musicbrainzService');
const musicbrainzService = require('../src/services/musicbrainzService');

const app = require('../src/server');

describe('Server API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/search-artist', () => {
    it('should return artist search results when artist name is provided', async () => {
      const mockResponse = {
        artists: [
          { id: 'test-id-1', name: 'Test Artist 1' },
          { id: 'test-id-2', name: 'Test Artist 2' }
        ]
      };

      musicbrainzService.searchArtists.mockResolvedValueOnce(mockResponse);

      const response = await request(app)
        .get('/api/search-artist')
        .query({ name: 'Beatles' });

      expect(response.status).toBe(200);
      expect(response.body.artists).toBeDefined();
      expect(response.body.artists.length).toBeGreaterThan(0);
    });

        it('should return 400 error when artist name is missing', async () => {
            const response = await request(app)
                .get('/api/search-artist');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Artist name is required');
        });

        it('should return 400 error when artist name is empty', async () => {
            const response = await request(app)
                .get('/api/search-artist')
                .query({ name: '' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Artist name is required');
        });

    it('should handle API errors gracefully', async () => {
      musicbrainzService.searchArtists.mockRejectedValueOnce(new Error('Network error'));

      const response = await request(app)
        .get('/api/search-artist')
        .query({ name: 'Beatles' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
    });

    describe('GET /api/artist/:mbid', () => {
    it('should return artist details when valid MBID is provided', async () => {
      const mockArtist = {
        id: 'test-mbid',
        name: 'Test Artist',
        type: 'Person'
      };

      musicbrainzService.getArtistDetails.mockResolvedValueOnce(mockArtist);

      const response = await request(app)
        .get('/api/artist/test-mbid');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('test-mbid');
      expect(response.body.name).toBe('Test Artist');
    });

        it('should return 400 error when MBID is missing', async () => {
            const response = await request(app)
                .get('/api/artist/');

            expect(response.status).toBe(404);
        });

    it('should handle API errors gracefully', async () => {
      musicbrainzService.getArtistDetails.mockRejectedValueOnce(new Error('Artist not found'));

      const response = await request(app)
        .get('/api/artist/invalid-mbid');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
    });

    describe('GET /api/artist/:mbid/releases', () => {
    it('should return artist releases when valid MBID is provided', async () => {
      const mockReleases = {
        releases: [
          { id: 'release-1', title: 'Album 1' },
          { id: 'release-2', title: 'Album 2' }
        ]
      };

      musicbrainzService.getArtistReleases.mockResolvedValueOnce(mockReleases);

      const response = await request(app)
        .get('/api/artist/test-mbid/releases');

      expect(response.status).toBe(200);
      expect(response.body.releases).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      musicbrainzService.getArtistReleases.mockRejectedValueOnce(new Error('Failed to fetch releases'));

      const response = await request(app)
        .get('/api/artist/test-mbid/releases');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
    });

    describe('GET /api/artist/:mbid/similar', () => {
    it('should return similar artists when valid MBID and genre are provided', async () => {
      const mockSimilarArtists = {
        artists: [
          { id: 'similar-1', name: 'Similar Artist 1' },
          { id: 'similar-2', name: 'Similar Artist 2' }
        ],
        originalArtist: {
          id: 'test-mbid',
          name: 'Test Artist'
        }
      };

      musicbrainzService.findSimilarArtists.mockResolvedValueOnce(mockSimilarArtists);

      const response = await request(app)
        .get('/api/artist/test-mbid/similar')
        .query({ genre: 'rock' });

      expect(response.status).toBe(200);
      expect(response.body.artists).toBeDefined();
    });

        it('should return 400 error when genre is missing', async () => {
            const response = await request(app)
                .get('/api/artist/test-mbid/similar');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Genre is required');
        });

    it('should handle API errors gracefully', async () => {
      musicbrainzService.findSimilarArtists.mockRejectedValueOnce(new Error('Failed to find similar artists'));

      const response = await request(app)
        .get('/api/artist/test-mbid/similar')
        .query({ genre: 'rock' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
    });

    describe('GET /api/release/:releaseId/recordings', () => {
    it('should return release recordings when valid release ID is provided', async () => {
      const mockRelease = {
        id: 'release-1',
        title: 'Test Album',
        media: [
          {
            tracks: [
              { recording: { title: 'Track 1', length: 180000 } },
              { recording: { title: 'Track 2', length: 200000 } }
            ]
          }
        ]
      };

      musicbrainzService.getReleaseRecordings.mockResolvedValueOnce(mockRelease);

      const response = await request(app)
        .get('/api/release/release-1/recordings');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('release-1');
      expect(response.body.media).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      musicbrainzService.getReleaseRecordings.mockRejectedValueOnce(new Error('Release not found'));

      const response = await request(app)
        .get('/api/release/invalid-release/recordings');

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
    });
});

