import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

// This component handles route redirects and navigation errors
const RouteHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [routeError, setRouteError] = useState(null);
  const [isDirectAccess, setIsDirectAccess] = useState(false);

  useEffect(() => {
    // Check if this is a direct access to the route
    const isDirectNavigation = performance.navigation && 
      performance.navigation.type === performance.navigation.TYPE_NAVIGATE;
    
    if (isDirectNavigation && location.pathname !== '/') {
      setIsDirectAccess(true);
      console.log('Direct access detected to route:', location.pathname);
    }
    
    // Clear any previous errors when route changes
    setRouteError(null);
    
    // Log navigation for debugging
    console.log('Route changed:', location.pathname);

    // Add error handling for route changes
    const handleRouteError = (error) => {
      console.error('Navigation error:', error);
      setRouteError(error.message || 'An unexpected error occurred');
    };

    // Listen for unhandled errors
    window.addEventListener('error', handleRouteError);

    // Clean up event listener
    return () => {
      window.removeEventListener('error', handleRouteError);
    };
  }, [location.pathname, navigate]);
  if (routeError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <ErrorMessage 
            title="Navigation Error"
            message={`${routeError}`} 
            onRetry={() => {
              setRouteError(null);
              navigate('/', { replace: true });
            }} 
          />
          <div className="mt-4 text-gray-600 text-sm">
            <p>You can try:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Going back to the <button 
                className="text-blue-500 hover:underline" 
                onClick={() => navigate('/')}>dashboard</button></li>
              <li>Checking the URL in your browser</li>
              <li>Logging out and logging back in</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RouteHandler;
