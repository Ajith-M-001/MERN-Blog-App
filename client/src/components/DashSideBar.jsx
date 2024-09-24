import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiDocumentText, HiUser } from "react-icons/hi";
import { HiMiniArrowRightOnRectangle } from "react-icons/hi2"; // Correct icon name
import { Link, useLocation, useNavigate } from "react-router-dom"; // Correct useNavigate import
import { useDispatch, useSelector } from "react-redux"; // Correct useDispatch import
import { signOutSuccess } from "../redux/features/user/userSlice";
import { FaUserAlt } from "react-icons/fa";
import { LiaComments } from "react-icons/lia";
import { MdSpaceDashboard } from "react-icons/md";

const DashSideBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { CurrentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/v1/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess(data));
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {CurrentUser && CurrentUser.isAdmin && (
            <Link to="/dashboard?tab=dashboard">
              <Sidebar.Item
                active={tab === "dashboard" || !tab}
                icon={MdSpaceDashboard}
                // label="User"
                // labelColor="dark"
                as="div"
              >
                DashBoard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={CurrentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {CurrentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  // label="User"
                  // labelColor="dark"
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={FaUserAlt}
                  // label="User"
                  // labelColor="dark"
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comment">
                <Sidebar.Item
                  active={tab === "comment"}
                  icon={LiaComments}
                  // label="User"
                  // labelColor="dark"
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <div onClick={handleSignOut}>
            <Sidebar.Item
              icon={HiMiniArrowRightOnRectangle} // Use correct icon name
              className="cursor-pointer"
            >
              Sign Out
            </Sidebar.Item>
          </div>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
