import { assets,} from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { UserButton, useClerk } from "@clerk/clerk-react";
import { useSelector } from 'react-redux'



const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = useSelector((state) =>state.user.value)
  const { signOut } = useClerk();

  return (
    <div
      className={`w-60 xl:w-60 h-screen bg-white border-r border-gray-200 flex flex-col justify-between max-sm:absolute top-0 bottom-0 z-20 ${
        sidebarOpen ? "translate-x-0" : "max-sm:translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        {/* <div className="flex flex-row justify-center items-center">
          <h1
            onClick={() => navigate("/")}
            className="flex items-center ml-7 my-2 cursor-pointer "
          >
            <img src={assets.biglogo} alt="" className="w-7 " />
            <span className='text-purple-600 font-bold mr-12'>CONNEXT</span>
          </h1>
        </div> */}
        <div onClick={() => navigate("/")} class="flex justify-center items-center text-4xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-pulse cursor-pointer">
              CONNEXT
            </div>
        <hr className="border-gray-300 mb-8" />
        <MenuItems setSidebarOpen={setSidebarOpen} />
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium">{user.full_name}</h1>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4 h-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Sidebar;
