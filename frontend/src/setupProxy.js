// This file configures the development server's proxy settings
// to handle API requests and SPA routing correctly

export default (app) => {
  // Forward API requests to the backend server
  app.use((req, res, next) => {
    if (req.url.startsWith('/user/') || 
        req.url.startsWith('/nilai/') || 
        req.url.startsWith('/matakuliah/')) {
      // Forward to the backend API
      console.log(`Proxying API request: ${req.url}`);
      next();
    } else if (req.method === 'GET' && !req.url.includes('.')) {
      // For non-API GET requests without file extensions, 
      // serve the index.html to support SPA routing
      console.log(`Handling SPA route: ${req.url}`);
      res.sendFile(path.resolve(__dirname, '../index.html'));
    } else {
      // For all other requests, proceed normally
      next();
    }
  });
};
