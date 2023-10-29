import { Navigate, Outlet } from "react-router-dom";

import SideBar from "./SideBar";
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { getAuthValues } from "../../redux/slices/auth";

const isAuthenticated = true;

const DashboardLayout = () => {
  const { isLoggedIn } = useSelector(getAuthValues());

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
