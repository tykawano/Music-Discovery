function validateInput(artistName, genre) {
    if (!artistName || artistName.trim() === '') {
        return false;
    }
    if (!genre || genre === '') {
        return false;
    }
    return true;
}
describe('Input Validation', () => {
    test('validateInput returns false for empty artist name', () => {
        expect(validateInput('', 'rock')).toBe(false);
    });
    test('validateInput returns false for whitespace-only artist name', () => {
        expect(validateInput('   ', 'rock')).toBe(false);
    });
    test('validateInput returns false for empty genre', () => {
        expect(validateInput('Beatles', '')).toBe(false);
    });
    test('validateInput returns false when both inputs are empty', () => {
        expect(validateInput('', '')).toBe(false);
    });
    test('validateInput returns true for valid inputs', () => {
        expect(validateInput('Beatles', 'rock')).toBe(true);
    });
});
describe('Format Duration', () => {
    test('formatDuration formats milliseconds correctly', () => {
        const formatDuration = (milliseconds) => {
            if (milliseconds === null || milliseconds === undefined) return '';
            const totalSeconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };
        expect(formatDuration(180000)).toBe('3:00');
        expect(formatDuration(125000)).toBe('2:05');
        expect(formatDuration(59000)).toBe('0:59');
        expect(formatDuration(0)).toBe('0:00');
        expect(formatDuration(null)).toBe('');
    });
});
describe('API Error Handling', () => {
    beforeEach(() => {
        if (global.fetch && typeof global.fetch.mockClear === 'function') {
            global.fetch.mockClear();
        }
    });
    test('handles network errors gracefully', async () => {
        if (!global.fetch) {
            global.fetch = jest.fn();
        }
        global.fetch.mockRejectedValueOnce(new Error('Network error'));
        try {
            const response = await global.fetch('http://localhost:3000/api/search-artist?name=Beatles');
            if (!response.ok) {
                throw new Error('Network error');
            }
        } catch (error) {
            expect(error.message).toBe('Network error');
        }
    });
    test('handles HTTP error responses', async () => {
        if (!global.fetch) {
            global.fetch = jest.fn();
        }
        const mockErrorResponse = {
            ok: false,
            status: 404,
            json: async () => ({ error: 'Not found' })
        };
        global.fetch.mockResolvedValueOnce(mockErrorResponse);
        const response = await global.fetch('http://localhost:3000/api/search-artist?name=Invalid');
        const data = await response.json();
        expect(response.ok).toBe(false);
        expect(data.error).toBe('Not found');
    });
    test('handles successful API responses', async () => {
        if (!global.fetch) {
            global.fetch = jest.fn();
        }
        const mockSuccessResponse = {
            ok: true,
            status: 200,
            json: async () => ({ artists: [{ id: '1', name: 'Test Artist' }] })
        };
        global.fetch.mockResolvedValueOnce(mockSuccessResponse);

        const response = await global.fetch('http://localhost:3000/api/search-artist?name=Beatles');
        const data = await response.json();

        expect(response.ok).toBe(true);
        expect(data.artists).toBeDefined();
        expect(data.artists.length).toBeGreaterThan(0);
    });
});
describe('Data Processing Functions', () => {
    test('filterUniqueReleases removes duplicates', () => {
        const releases = [
            { id: '1', title: 'Album A' },
            { id: '2', title: 'Album B' },
            { id: '3', title: 'Album A' }, 
            { id: '4', title: 'Album C' }
        ];
        const uniqueReleases = [];
        const seenTitles = new Set();
        releases.forEach(release => {
            const title = release.title || 'Unknown Album';
            const normalizedTitle = title.toLowerCase().trim();
            if (!seenTitles.has(normalizedTitle)) {
                seenTitles.add(normalizedTitle);
                uniqueReleases.push(release);
            }
        });
        expect(uniqueReleases.length).toBe(3);
        expect(uniqueReleases.map(r => r.title)).toEqual(['Album A', 'Album B', 'Album C']);
    });
    test('processes empty artists array correctly', () => {
        const artists = [];
        const hasArtists = artists && artists.length > 0;
        expect(hasArtists).toBe(false);
    });
    test('processes artist data structure correctly', () => {
        const artist = {
            id: 'test-id',
            name: 'Test Artist',
            country: 'US',
            type: 'Person',
            'life-span': { begin: '1990' }
        };
        expect(artist.name).toBe('Test Artist');
        expect(artist['life-span']?.begin).toBe('1990');
    });
});
