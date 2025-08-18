// App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connection from "./pages/Connection";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import CreatePost from "./pages/CreatePost";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";

export default function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          console.log("Clerk Token:", token); // debug
          dispatch(fetchUser(token));
        } catch (error) {
          console.error("Token fetch error:", error);
        }
      }
    };

    fetchData();
  }, [user, isSignedIn, getToken, dispatch]);

  // Show loading screen until Clerk finishes loading
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Toaster />
      <Routes>
        {/* Public route */}
        {!isSignedIn && <Route path="*" element={<Login />} />}

        {/* Protected routes */}
        {isSignedIn && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<ChatBox />} />
            <Route path="connections" element={<Connection />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:profileId" element={<Profile />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="discover" element={<Discover />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </>
  );
}
