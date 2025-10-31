const { getArtistReleases } = require('../../src/services/musicbrainzService');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Extract mbid from query parameters (set by redirect rule)
    const { mbid } = event.queryStringParameters || {};
    
    if (!mbid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Artist MBID is required' })
      };
    }

    const releases = await getArtistReleases(mbid);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(releases)
    };
  } catch (error) {
    console.error('Error fetching artist releases:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch artist releases', 
        message: error.message 
      })
    };
  }
};

