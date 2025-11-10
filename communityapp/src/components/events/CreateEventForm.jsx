import React, { useState } from 'react';
import { createEvent } from '../../services/api';
import ErrorMessage from '../common/ErrorMessage';

function CreateEventForm({ onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createEvent(formData);
      // Reset form and notify parent
      setFormData({ title: '', description: '', date: '', location: '' });
      onEventCreated(); // Refreshes the event list
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create event.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">Create New Event</h3>
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        <div className="form-group">
          <label className="form-label" htmlFor="event-title">Event Title</label>
          <input
            id="event-title"
            name="title"
            type="text"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="event-desc">Description</label>
          <textarea
            id="event-desc"
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="event-date">Date and Time</label>
          <input
            id="event-date"
            name="date"
            type="datetime-local"
            className="form-input"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="event-location">Location</label>
          <input
            id="event-location"
            name="location"
            type="text"
            className="form-input"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEventForm;