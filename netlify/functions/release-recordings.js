const { getReleaseRecordings } = require('../../src/services/musicbrainzService');

// Helper to extract releaseId from various event properties
function extractReleaseId(event) {
  // Try query parameters first
  if (event.queryStringParameters?.releaseId) {
    return event.queryStringParameters.releaseId;
  }
  
  // Try path extraction from multiple sources
  const pathsToCheck = [
    event.path,
    event.rawPath,
    event.headers?.['x-forwarded-path'] || event.headers?.['x-forwarded-uri'],
    event.requestContext?.http?.path
  ].filter(Boolean);
  
  for (const path of pathsToCheck) {
    // Try /api/release/{releaseId}/recordings pattern
    let match = path.match(/\/api\/release\/([^\/\?]+)/);
    if (!match) {
      // Try /release/{releaseId} pattern (if path doesn't have /api)
      match = path.match(/\/release\/([^\/\?]+)/);
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
    const releaseId = extractReleaseId(event);
    
    if (!releaseId) {
      console.error('Release ID not found. Event:', JSON.stringify({
        path: event.path,
        rawPath: event.rawPath,
        queryStringParameters: event.queryStringParameters,
        headers: event.headers
      }, null, 2));
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Release ID is required' })
      };
    }

    const release = await getReleaseRecordings(releaseId);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(release)
    };
  } catch (error) {
    console.error('Error fetching release recordings:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch release recordings', 
        message: error.message 
      })
    };
  }
};

