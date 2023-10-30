import { Container, Stack } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Logo from "../../assets/Images/logo_UniChat.png";
import { getIsLoggedIn } from "../../redux/slices/auth";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());

  if (isLoggedIn) {
    return <Navigate to="/app" />;
  }

  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack sx={{ width: "100%" }} direction="column" alignItems="center">
            <img
              style={{ height: 120, width: 120, borderRadius: "20px" }}
              src={Logo}
              alt="Logo"
            />
          </Stack>
        </Stack>

        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
