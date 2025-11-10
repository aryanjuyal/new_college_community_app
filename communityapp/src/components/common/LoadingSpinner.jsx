import React from 'react';

function LoadingSpinner({ fullPage = true }) {
  if (fullPage) {
    return (
      <div className="loading-spinner-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  return <div className="loading-spinner"></div>;
}

export default LoadingSpinner;