import { Navigate, Outlet } from "react-router-dom";

import SideBar from "./SideBar";
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/slices/auth";

const DashboardLayout = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Stack direction="row">
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
