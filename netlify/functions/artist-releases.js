const { getArtistReleases } = require('../../src/services/musicbrainzService');

function extractMbid(event) {
  if (event.queryStringParameters?.mbid) {
    return event.queryStringParameters.mbid;
  }
  
  const pathsToCheck = [
    event.path,
    event.rawPath,
    event.headers?.['x-forwarded-path'] || event.headers?.['x-forwarded-uri'],
    event.requestContext?.http?.path
  ].filter(Boolean);
  
  for (const path of pathsToCheck) {
    let match = path.match(/\/api\/artist\/([^\/\?]+)/);
    if (!match) {
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

