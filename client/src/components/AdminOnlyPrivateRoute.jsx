import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminOnlyPrivateRoute = () => {
  const currentUser = useSelector((state) => state.user.CurrentUser);
  return (
    <div>{currentUser.isAdmin ? <Outlet /> : <Navigate to="sign-in" />}</div>
  );
};

export default AdminOnlyPrivateRoute;
