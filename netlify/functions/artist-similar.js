const { findSimilarArtists } = require('../../src/services/musicbrainzService');

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
    // Extract mbid and genre from query parameters (set by redirect rule)
    const { mbid, genre } = event.queryStringParameters || {};
    
    if (!mbid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Artist MBID is required' })
      };
    }
    
    if (!genre) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Genre is required' })
      };
    }

    const results = await findSimilarArtists(mbid, genre);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Error finding similar artists:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to find similar artists', 
        message: error.message 
      })
    };
  }
};

