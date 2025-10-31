# Activity / Lab / Assignment / Project Title

**[Optional]** If what is being submitted is an individual Lab or Assignment. Otherwise, include a brief one paragraph description about the project.

* *Date Created*: 31 10 2025
* *Last Modification Date*: 31 10 2025
* *Lab URL*: https://git.cs.dal.ca/tkawano/lab1
* *WEB URL*: 


## Authors

If what is being submitted is an individual Lab or Assignment, you may simply include your name and email address. Otherwise list the members of your group.

* [Taiki](tk711146@dal.ca)


## Built With

<!--- Provide a list of the frameworks used to build this application, your list should include the name of the framework used, the url where the framework is available for download and what the framework was used for, see the example below --->

* [Node.js](https://nodejs.org/) - The JavaScript runtime environment used to run the server-side application
* [Express.js](https://expressjs.com/) - The web framework used for building the RESTful API server
* [Bootstrap 5](https://getbootstrap.com/) - The CSS framework used for responsive UI design and styling
* [Axios](https://axios-http.com/) - HTTP client library used for making requests to the MusicBrainz API
* [CORS](https://github.com/expressjs/cors) - Middleware used to enable Cross-Origin Resource Sharing
* [Jest](https://jestjs.io/) - JavaScript testing framework used for unit testing
* [Supertest](https://github.com/visionmedia/supertest) - HTTP assertion library used for testing API endpoints
* [Nodemon](https://nodemon.io/) - Development tool used for automatically restarting the server during development
* [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API) - External API used to retrieve artist, album, and track information



## Sources Used

If in completing your lab / assignment / project you used any interpretation of someone else's code, then provide a list of where the code was implemented, how it was implemented, why it was implemented, and how it was modified. See the sections below for more details.


### src/routes/artistRoutes.js

*Lines 1-2*

```javascript
const express = require('express');
const router = express.Router();
```

The code above was created by adapting the code in [Express.js Documentation](https://expressjs.com/en/guide/routing.html) as shown below: 

```
// Example from Express.js documentation
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('Birds home page')
});
```

- <!---How---> The code in [Express.js Documentation](https://expressjs.com/en/guide/routing.html) was implemented by importing the Express Router module and creating a router instance to organize route handlers separately from the main server file.
- <!---Why---> [Express.js Documentation](https://expressjs.com/en/guide/routing.html)'s Code was used because it provides a clean way to modularize routes and improve code organization.
- <!---How---> [Express.js Documentation](https://expressjs.com/en/guide/routing.html)'s Code was modified by implementing multiple route handlers for different API endpoints (search-artist, artist/:mbid, etc.) with async/await syntax and error handling specific to our application needs.


### src/services/musicbrainzService.js

*Lines 13-33*

```javascript
async function makeMusicBrainzRequest(url, params = {}) {
  // Rate limiting: ensure at least 1 second between requests
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
```

The code above was created by adapting the code in [MusicBrainz API Documentation](https://musicbrainz.org/doc/MusicBrainz_API) and [Axios Documentation](https://axios-http.com/docs/req_config) as shown below: 

```
// MusicBrainz requires a User-Agent header in all requests
headers: {
  'User-Agent': 'YourAppName/1.0.0 ( your-email@example.com )'
}

// Axios GET request example
axios.get(url, {
  params: { key: value },
  headers: { 'User-Agent': '...' }
})
```

- <!---How---> The code in [MusicBrainz API Documentation](https://musicbrainz.org/doc/MusicBrainz_API) and [Axios Documentation](https://axios-http.com/docs/req_config) was implemented by creating a wrapper function that makes HTTP requests to the MusicBrainz API with the required User-Agent header and implements rate limiting to comply with API restrictions.
- <!---Why---> [MusicBrainz API Documentation](https://musicbrainz.org/doc/MusicBrainz_API)'s requirement for User-Agent headers was used because MusicBrainz requires all API clients to identify themselves with a proper User-Agent string. The rate limiting was added to comply with MusicBrainz's 1 request per second limit.
- <!---How---> The code was modified by adding custom rate limiting logic using timestamps, implementing error handling with try-catch blocks, and structuring it as a reusable service function that can be called by multiple route handlers.


### src/middleware/errorHandler.js

*Lines 5-10*

```javascript
function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled error:', err);
  }
  res.status(500).json({ error: 'Internal server error', message: err.message });
}
```

The code above was created by adapting the code in [Express.js Error Handling Documentation](https://expressjs.com/en/guide/error-handling.html) as shown below: 

```
// Express.js error handling middleware example
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

- <!---How---> The code in [Express.js Error Handling Documentation](https://expressjs.com/en/guide/error-handling.html) was implemented by creating a custom error handling middleware function that follows Express.js's four-parameter signature (err, req, res, next) to catch unhandled errors.
- <!---Why---> [Express.js Error Handling Documentation](https://expressjs.com/en/guide/error-handling.html)'s Code was used because Express.js requires error handling middleware to have exactly four parameters, and this pattern provides a centralized way to handle errors across the application.
- <!---How---> The code was modified by adding conditional logging that suppresses console output during testing, returning JSON error responses instead of plain text, and structuring it as a separate module for better organization.


### tests/server.test.js

*Lines 1-7, 25-31*

```javascript
const request = require('supertest');

// Mock the MusicBrainz service before importing the app
jest.mock('../src/services/musicbrainzService');
const musicbrainzService = require('../src/services/musicbrainzService');

const app = require('../src/server');

// ... test code ...
const response = await request(app)
  .get('/api/search-artist')
  .query({ name: 'Beatles' });
```

The code above was created by adapting the code in [Supertest Documentation](https://github.com/visionmedia/supertest) and [Jest Documentation](https://jestjs.io/docs/manual-mocks) as shown below: 

```
// Supertest example
const request = require('supertest');
const app = require('../app');

request(app)
  .get('/user')
  .expect('Content-Type', /json/)
  .expect(200, done);

// Jest mock example
jest.mock('../module');
const module = require('../module');
```

- <!---How---> The code in [Supertest Documentation](https://github.com/visionmedia/supertest) and [Jest Documentation](https://jestjs.io/docs/manual-mocks) was implemented by using Supertest's request() function to make HTTP assertions on Express routes, and using Jest's jest.mock() to mock the MusicBrainz service layer before importing the server.
- <!---Why---> [Supertest Documentation](https://github.com/visionmedia/supertest)'s Code was used because it provides a high-level abstraction for testing HTTP endpoints in Express applications. [Jest Documentation](https://jestjs.io/docs/manual-mocks)'s mocking pattern was used to isolate unit tests from external API dependencies.
- <!---How---> The code was modified by applying it to test multiple API endpoints (search-artist, artist/:mbid, releases, etc.), using async/await syntax instead of callbacks, and combining it with Jest's mocking to test route handlers without making actual API calls.


### src/server.js

*Lines 10-13*

```javascript
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
```

The code above was created by adapting the code in [Express.js Documentation](https://expressjs.com/en/starter/static-files.html) and [CORS Documentation](https://github.com/expressjs/cors) as shown below: 

```
// Express static files example
app.use(express.static('public'));

// CORS middleware example
const cors = require('cors');
app.use(cors());
```

- <!---How---> The code in [Express.js Documentation](https://expressjs.com/en/starter/static-files.html) and [CORS Documentation](https://github.com/expressjs/cors) was implemented by registering middleware functions in the Express application to enable CORS, parse JSON request bodies, and serve static files from the public directory.
- <!---Why---> [Express.js Documentation](https://expressjs.com/en/starter/static-files.html)'s Code was used because Express needs middleware to serve static files and parse JSON. [CORS Documentation](https://github.com/expressjs/cors)'s middleware was used to enable cross-origin requests for the frontend application.
- <!---How---> The code was modified by using path.join() to construct the static file path relative to the project structure, and organizing middleware registration in a clear order (CORS first, then JSON parsing, then static files).



## Artificial Intelligence Tools Used
If in completing your lab / assignment / project you used any Artificial Intelligence Tools or Plugins, then provide a list of the tools or plugins used, the prompt used, the code generated by the AI, where the code was implemented, how it was implemented, why it was implemented, and how it was modified. See the sections below for more details.

* [ChatGPT](https://chat.openai.com/) - The AI Tool used for code generation, debugging, and project structure guidance


### Prompt Used on ChatGPT

```
How to create a Node.js server with Express.js that serves static files and has API routes for a music discovery application?
```

The code prompt above was used [ChatGPT](https://chat.openai.com/) to generate the code shown below: 

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### File Name
*src/server.js*
*Lines 1-28*

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT } = require('./config/constants');
const artistRoutes = require('./routes/artistRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', artistRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server only if not in test environment or if running directly (not being imported)
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Music Discovery App server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
```

- <!---How---> The code in [ChatGPT](https://chat.openai.com/) was implemented by creating the main server file with Express.js setup, middleware configuration, and route registration following the provided structure.
- <!---Why---> [ChatGPT](https://chat.openai.com/)'s Code was used because it provided a solid foundation for setting up an Express.js server with proper middleware configuration and static file serving.
- <!---How---> [ChatGPT](https://chat.openai.com/)'s Code was modified by adding conditional server startup for testing environments, modularizing routes into separate files, adding error handling middleware, and using environment variables for configuration.


### Prompt Used on ChatGPT

```
How to write unit tests for Express.js API routes using Jest and Supertest with mocking?
```

The code prompt above was used [ChatGPT](https://chat.openai.com/) to generate the code shown below: 

```javascript
const request = require('supertest');
const app = require('../app');

jest.mock('../services/musicbrainzService');

describe('GET /api/search-artist', () => {
  it('should return artist search results', async () => {
    const response = await request(app)
      .get('/api/search-artist')
      .query({ name: 'Beatles' });
    
    expect(response.status).toBe(200);
  });
});
```

#### File Name
*tests/server.test.js*
*Lines 1-32*

```javascript
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
```

- <!---How---> The code in [ChatGPT](https://chat.openai.com/) was implemented by creating test files using Jest and Supertest to test API endpoints, with proper mocking of service dependencies.
- <!---Why---> [ChatGPT](https://chat.openai.com/)'s Code was used because it demonstrated the correct pattern for testing Express.js routes with mocked dependencies, which is essential for unit testing without external API calls.
- <!---How---> [ChatGPT](https://chat.openai.com/)'s Code was modified by adding comprehensive test cases for multiple endpoints (search-artist, artist details, releases, similar artists, recordings), implementing beforeEach hooks to clear mocks, and testing error handling scenarios.


### Prompt Used on ChatGPT

```
How to integrate MusicBrainz API with rate limiting and proper User-Agent headers in Node.js?
```

The code prompt above was used [ChatGPT](https://chat.openai.com/) to generate the code shown below: 

```javascript
const axios = require('axios');

let lastRequestTime = 0;
const MIN_INTERVAL = 1000;

async function makeRequest(url, params) {
  const now = Date.now();
  if (now - lastRequestTime < MIN_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - (now - lastRequestTime)));
  }
  
  const response = await axios.get(url, {
    params,
    headers: { 'User-Agent': 'MyApp/1.0' }
  });
  
  return response.data;
}
```

#### File Name
*src/services/musicbrainzService.js*
*Lines 13-33*

```javascript
async function makeMusicBrainzRequest(url, params = {}) {
  // Rate limiting: ensure at least 1 second between requests
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
```

- <!---How---> The code in [ChatGPT](https://chat.openai.com/) was implemented by creating a service layer that handles all MusicBrainz API requests with built-in rate limiting and proper header configuration.
- <!---Why---> [ChatGPT](https://chat.openai.com/)'s Code was used because MusicBrainz API requires a User-Agent header and has a 1 request per second rate limit, which needs to be handled programmatically.
- <!---How---> [ChatGPT](https://chat.openai.com/)'s Code was modified by extracting constants to a configuration file, adding comprehensive error handling with try-catch blocks, creating multiple wrapper functions for different API endpoints (searchArtists, getArtistDetails, getArtistReleases, etc.), and ensuring proper JSON format parameter inclusion.


### Prompt Used on ChatGPT

```
How to improve web page design with clean animations and modern colors using Bootstrap without gradients?
```

The code prompt above was used [ChatGPT](https://chat.openai.com/) to generate the code shown below: 

```css
:root {
    --primary-purple: #6366f1;
    --accent-pink: #ec4899;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-section {
    animation: fadeInUp 0.8s ease;
}
```

#### File Name
*public/css/styles.css*
*Lines 1-200+ (selected portions)*

```css
:root {
    --primary-purple: #6366f1;
    --primary-blue: #3b82f6;
    --accent-pink: #ec4899;
    --accent-orange: #f59e0b;
    --accent-green: #10b981;
    /* ... more color variables ... */
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-section {
    text-align: center;
    padding: var(--spacing-xl) 0;
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.8s ease;
}

.btn-search {
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
}

.btn-search:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}
```

- <!---How---> The code in [ChatGPT](https://chat.openai.com/) was implemented by creating a comprehensive CSS file with custom animations, color schemes, and modern styling that complements Bootstrap.
- <!---Why---> [ChatGPT](https://chat.openai.com/)'s Code was used because it provided guidance on creating modern, animated UI designs using CSS animations and CSS custom properties for a cohesive color scheme.
- <!---How---> [ChatGPT](https://chat.openai.com/)'s Code was modified by creating a full design system with multiple animations (fadeInUp, slideDown, bounce, pulse, float), implementing hover effects, adding accessibility features (focus indicators, reduced motion support), and creating a complete responsive layout with custom components.


### Prompt Used on ChatGPT

```
How to properly structure a Node.js project with separate folders for routes, services, and middleware?
```

The code prompt above was used [ChatGPT](https://chat.openai.com/) to generate the code shown below: 

```
Project structure:
- src/
  - routes/
  - services/
  - middleware/
  - server.js
- public/
  - css/
  - js/
- tests/
```

#### File Name
*Project Structure - Multiple Files*

The project was restructured as follows:
```
src/
├── config/
│   └── constants.js
├── services/
│   └── musicbrainzService.js
├── routes/
│   └── artistRoutes.js
├── middleware/
│   └── errorHandler.js
└── server.js

public/
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── index.html

tests/
├── server.test.js
├── app.test.js
└── setup.js
```

- <!---How---> The code in [ChatGPT](https://chat.openai.com/) was implemented by reorganizing the entire project structure, separating concerns into dedicated folders (config, services, routes, middleware), and moving client-side assets into organized subdirectories.
- <!---Why---> [ChatGPT](https://chat.openai.com/)'s Code was used because it provided a scalable and maintainable project structure following Node.js best practices, making the codebase easier to navigate and extend.
- <!---How---> [ChatGPT](https://chat.openai.com/)'s Code was modified by implementing a complete refactoring that split the original server.js into multiple modules, created a configuration folder for constants, organized client assets into css/ and js/ folders, updated all import paths, and ensured all tests continued to work with the new structure.



## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

Lecture videos