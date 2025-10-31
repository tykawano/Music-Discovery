const { getReleaseRecordings } = require('../../src/services/musicbrainzService');

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
    // Extract releaseId from query parameters (set by redirect rule)
    const { releaseId } = event.queryStringParameters || {};
    
    if (!releaseId) {
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

