export const handleApiError = (error, showToast) => {
  console.error('API Error:', error);

  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Unauthorized - clear auth and redirect
        localStorage.removeItem('slabtrack_token');
        localStorage.removeItem('slabtrack_user');
        window.location.href = '/login';
        return 'Session expired. Please login again.';
        
      case 403:
        return 'You do not have permission to perform this action.';
        
      case 404:
        return 'The requested resource was not found.';
        
      case 422:
        // Validation errors
        if (data.error && data.error.details) {
          return data.error.details.map(d => d.message).join(', ');
        }
        return data.error?.message || 'Validation error occurred.';
        
      case 500:
        return 'Internal server error. Please try again later.';
        
      default:
        return data.error?.message || `Request failed with status ${status}`;
    }
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return 'An unexpected error occurred.';
  }
};