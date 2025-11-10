import React, { useState, useEffect, useCallback } from 'react';
import { getEvents } from '../services/api';
import useAuth from '../hooks/useAuth';
import CreateEventForm from '../components/events/CreateEventForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const isAdminOrFaculty = user.userType === 'admin' || user.userType === 'faculty';

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getEvents();
      setEvents(response.data.events || response.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch events.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Format date for the event item
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  return (
    <>
      <h1 className="page-title">Upcoming Events</h1>
      {isAdminOrFaculty && (
        <CreateEventForm onEventCreated={fetchEvents} />
      )}
      
      <div className="event-list" style={{ marginTop: '2rem' }}>
        {isLoading && <LoadingSpinner fullPage={false} />}
        <ErrorMessage message={error} />
        {events.map((event) => {
          const { month, day } = formatEventDate(event.date);
          return (
            <div key={event._id} className="card event-item">
              <div className="event-date">
                <span className="event-date-month">{month}</span>
                <span className="event-date-day">{day}</span>
              </div>
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <span className="event-location">
                  <strong>Location:</strong> {event.location}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default EventsPage;