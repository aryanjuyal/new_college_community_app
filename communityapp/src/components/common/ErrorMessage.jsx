import React from 'react';

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-message">
      {message}
    </div>
  );
}

export default ErrorMessage;