const axios = require('axios');
const { MUSICBRAINZ_BASE_URL, USER_AGENT, MIN_REQUEST_INTERVAL } = require('../config/constants');
let lastRequestTime = 0;
async function makeMusicBrainzRequest(url, params = {}) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
  try {
    const response = await axios.get(url, {
      params: { ...params, fmt: 'json' },
      headers: {
        'User-Agent': USER_AGENT
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`MusicBrainz API error: ${error.message}`);
  }
}
async function searchArtists(query) {
  const url = `${MUSICBRAINZ_BASE_URL}/artist/`;
  const params = { query };
  return await makeMusicBrainzRequest(url, params);
}
async function getArtistDetails(mbid) {
  const url = `${MUSICBRAINZ_BASE_URL}/artist/${mbid}`;
  const params = {
    inc: 'tags+aliases+ratings'
  };
  return await makeMusicBrainzRequest(url, params);
}
async function getArtistReleases(mbid) {
  const url = `${MUSICBRAINZ_BASE_URL}/release/`;
  const params = {
    artist: mbid,
    limit: 25
  };
  return await makeMusicBrainzRequest(url, params);
}
async function getReleaseRecordings(releaseId) {
  const url = `${MUSICBRAINZ_BASE_URL}/release/${releaseId}`;
  const params = {
    inc: 'recordings'
  };
  return await makeMusicBrainzRequest(url, params);
}
async function findSimilarArtists(mbid, genre) {
  try {
    const artist = await getArtistDetails(mbid);
    const url = `${MUSICBRAINZ_BASE_URL}/artist/`;
    const params = {
      query: `tag:${genre}`,
      limit: 20
    };
    const similarArtists = await makeMusicBrainzRequest(url, params);
    const filtered = similarArtists.artists.filter(a => a.id !== mbid);
    return {
      artists: filtered.slice(0, 10), 
      originalArtist: artist
    };
  } catch (error) {
    throw error;
  }
}
module.exports = {
  searchArtists,
  getArtistDetails,
  getArtistReleases,
  getReleaseRecordings,
  findSimilarArtists
};