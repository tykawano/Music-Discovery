const express = require('express');
const router = express.Router();
const musicbrainzService = require('../services/musicbrainzService');
router.get('/search-artist', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Artist name is required' });
    }
    const results = await musicbrainzService.searchArtists(name);
    res.json(results);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error searching artist:', error);
    }
    res.status(500).json({ error: 'Failed to search for artist', message: error.message });
  }
});
router.get('/artist/:mbid', async (req, res) => {
  try {
    const { mbid } = req.params;
    if (!mbid) {
      return res.status(400).json({ error: 'Artist MBID is required' });
    }
    const artist = await musicbrainzService.getArtistDetails(mbid);
    res.json(artist);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error fetching artist details:', error);
    }
    res.status(500).json({ error: 'Failed to fetch artist details', message: error.message });
  }
});
router.get('/artist/:mbid/releases', async (req, res) => {
  try {
    const { mbid } = req.params;
    if (!mbid) {
      return res.status(400).json({ error: 'Artist MBID is required' });
    }
    const releases = await musicbrainzService.getArtistReleases(mbid);
    res.json(releases);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error fetching artist releases:', error);
    }
    res.status(500).json({ error: 'Failed to fetch artist releases', message: error.message });
  }
});
router.get('/artist/:mbid/similar', async (req, res) => {
  try {
    const { mbid } = req.params;
    const { genre } = req.query;
    if (!mbid) {
      return res.status(400).json({ error: 'Artist MBID is required' });
    }
    if (!genre) {
      return res.status(400).json({ error: 'Genre is required' });
    }
    const results = await musicbrainzService.findSimilarArtists(mbid, genre);
    res.json(results);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error finding similar artists:', error);
    }
    res.status(500).json({ error: 'Failed to find similar artists', message: error.message });
  }
});
router.get('/release/:releaseId/recordings', async (req, res) => {
  try {
    const { releaseId } = req.params;
    if (!releaseId) {
      return res.status(400).json({ error: 'Release ID is required' });
    }
    const release = await musicbrainzService.getReleaseRecordings(releaseId);
    res.json(release);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error fetching release recordings:', error);
    }
    res.status(500).json({ error: 'Failed to fetch release recordings', message: error.message });
  }
});
module.exports = router;