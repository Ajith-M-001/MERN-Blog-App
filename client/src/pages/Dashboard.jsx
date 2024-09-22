import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("profile"); // Set default tab to "profile"

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-56">
        <DashSideBar />
      </div>
      {/* Profile or Posts depending on the tab */}
      <div className="md:w-full">
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {!["profile", "posts","users"].includes(tab) && (
          <div className="p-4">Invalid tab. Please select a valid option.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
