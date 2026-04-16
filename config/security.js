module.exports.security = {
  cors: {
    // Allow all routes to be accessed via CORS
    allRoutes: true,

    // Allow these origins (add more as needed)
    allowOrigins: [
      'http://localhost:1337',
      'http://127.0.0.1:1337',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:63342'
    ],

    // Allow these methods
    allowRequestMethods: 'GET,POST,PUT,DELETE,OPTIONS,HEAD',

    // Allow these headers
    allowRequestHeaders: 'content-type,authorization,x-requested-with',

    // Don't allow credentials (cookies, authorization headers)
    allowCredentials: false
  },

  csrf: false

};
