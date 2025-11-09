import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public route: Login/Register */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes (User must be logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<FeedPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;