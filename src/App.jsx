import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/authSlice';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import AuthSuccess from './pages/AuthSuccess';
import DashboardPage from './pages/DashboardPage';
import GoogleOneTap from './components/GoogleOneTap';
import NotificationsPage from './pages/NotificationsPage';
import MainFeedPage from './pages/MainFeedPage';
import DiscoverGroupsPage from './pages/DiscoverGroupsPage';
import GroupFeedPage from './pages/GroupFeedPage';
import ProfilePage from './pages/ProfilePage';
import GroupAdminPage from './pages/GroupAdminPage';
import JoinRequestsPage from './pages/JoinRequestsPage';
import PracticePage from './pages/PracticePage';
import QuizzesPage from './pages/QuizzesPage';
import QuizPlayerPage from './pages/QuizPlayerPage';
import QuizHistoryPage from './pages/QuizHistoryPage';
import InterviewFeedback from './components/practice/InterviewFeedback';
import InterviewHistory from './components/practice/InterviewHistory';
import SettingsPage from './pages/SettingsPage';
import MessagesPage from './pages/MessagesPage';
import EventsPage from './pages/EventsPage';
import LiveRoomPage from './pages/LiveRoomPage';
import FriendsPage from './pages/FriendsPage';
import JoinedGroupsPage from './pages/JoinedGroupsPage';
import JoinPreviewPage from './pages/JoinPreviewPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupMembersPage from './pages/GroupMembersPage';
import GroupDiscussionPage from './pages/GroupDiscussionPage';
import GroupResourcesPage from './pages/GroupResourcesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NoGroupsPage from './pages/NoGroupsPage';
import SinglePostPage from './pages/SinglePostPage';
import SavedPostsPage from './pages/SavedPostsPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute';
import { SocketProvider } from './context/SocketContext';
import { CallProvider } from './context/CallContext';

function App() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <CallProvider>
        <ToastContainer theme="dark" position="top-right" autoClose={3000} limit={1} />
        {!user && <GoogleOneTap />}
        <Routes>
          {/* ... existing routes ... */}
          <Route
            path="/"
            element={user ? <Navigate to="/feed" replace /> : <LandingPage />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/feed" replace /> : <SignupPage />}
          />
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><MainFeedPage /></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><DiscoverGroupsPage /></ProtectedRoute>} />
          <Route path="/groups/:id" element={<ProtectedRoute><GroupFeedPage /></ProtectedRoute>} />
          <Route path="/groups/:id/members" element={<ProtectedRoute><GroupMembersPage /></ProtectedRoute>} />
          <Route path="/groups/:id/discussion" element={<ProtectedRoute><GroupDiscussionPage /></ProtectedRoute>} />
          <Route path="/groups/:id/discussion/:discussionSlug/messages" element={<ProtectedRoute><GroupDiscussionPage /></ProtectedRoute>} />
          <Route path="/groups/:id/resources" element={<ProtectedRoute><GroupResourcesPage /></ProtectedRoute>} />
          <Route path="/groups/:id/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/create-group" element={<ProtectedRoute><CreateGroupPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/:userNameAndId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/post/:userNameAndId" element={<ProtectedRoute><SinglePostPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/admin/groups/:id/discussion/:discussionSlug/messages" element={<ProtectedRoute><GroupAdminPage activeTabProp="Discussion" /></ProtectedRoute>} />
          <Route path="/admin/groups/:id/requests" element={<ProtectedRoute><JoinRequestsPage /></ProtectedRoute>} />
          <Route path="/admin/groups/:id/:tab?" element={<ProtectedRoute><GroupAdminPage /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
          <Route path="/interview/history" element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
          <Route path="/interview/feedback/:id" element={<ProtectedRoute><InterviewFeedback /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
          <Route path="/quiz-history" element={<ProtectedRoute><QuizHistoryPage /></ProtectedRoute>} />
          <Route path="/play-quiz" element={<ProtectedRoute><QuizPlayerPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/messages/:conversationId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/events/join/:eventId" element={<ProtectedRoute><JoinPreviewPage /></ProtectedRoute>} />
          <Route path="/live-room" element={<ProtectedRoute><LiveRoomPage /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
          <Route path="/joined-groups" element={<ProtectedRoute><JoinedGroupsPage /></ProtectedRoute>} />
          <Route path="/no-groups" element={<ProtectedRoute><NoGroupsPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedPostsPage /></ProtectedRoute>} />

          {/* Catch all - Redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CallProvider>
    </SocketProvider>
  );
}

export default App;
