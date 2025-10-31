const { findSimilarArtists } = require('../../src/services/musicbrainzService');

// Helper to extract mbid from various event properties
function extractMbid(event) {
  // Try query parameters first
  if (event.queryStringParameters?.mbid) {
    return event.queryStringParameters.mbid;
  }
  
  // Try path extraction from multiple sources
  const pathsToCheck = [
    event.path,
    event.rawPath,
    event.headers?.['x-forwarded-path'] || event.headers?.['x-forwarded-uri'],
    event.requestContext?.http?.path
  ].filter(Boolean);
  
  for (const path of pathsToCheck) {
    // Try /api/artist/{mbid}/similar pattern
    let match = path.match(/\/api\/artist\/([^\/\?]+)/);
    if (!match) {
      // Try /artist/{mbid} pattern (if path doesn't have /api)
      match = path.match(/\/artist\/([^\/\?]+)/);
    }
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

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
    const mbid = extractMbid(event);
    const genre = event.queryStringParameters?.genre;
    
    if (!mbid) {
      console.error('MBID not found. Event:', JSON.stringify({
        path: event.path,
        rawPath: event.rawPath,
        queryStringParameters: event.queryStringParameters,
        headers: event.headers
      }, null, 2));
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Artist MBID is required' })
      };
    }
    
    if (!genre) {
      console.error('Genre not found. Query:', event.queryStringParameters);
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

