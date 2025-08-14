import { Route, Routes } from "react-router-dom";
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
import { useSelector } from "react-redux";
import Loading from "./components/Loading";
import api from "./api/axios";

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  
 const { loading, value: currentUser, error } = useSelector((state) => state.user)

 useEffect(() => {
  console.log("Redux state:", { loading, currentUser, error })
}, [loading, currentUser, error])

  useEffect(() => {
  const fetchData = async () => {
    if (user) {
      const token = await getToken();
      const result = await dispatch(fetchUser(token)).unwrap();

      if (!result) {
        await api.post("/api/user/create", {
          full_name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          profile_picture: user.imageUrl
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        dispatch(fetchUser(token)); // fetch again
      }
    }
  };

  fetchData();
}, [user, getToken, dispatch]);


  if (loading) {
  return <Loading />
}

if (!currentUser) {
  return <div className="p-10 text-center">No user found</div>
}
if (error || !currentUser) {
  console.error("User fetch failed:", error)
  return <Login />
}

  if (!user) {
    return <Login />;
  }

  // Wait for Redux user fetch before rendering routes
  if (loading && !currentUser) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connection />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="discover" element={<Discover />} />
        </Route>
      </Routes>
    </>
  );
};


export default App;
