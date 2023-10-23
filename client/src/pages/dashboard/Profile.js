import { Box, IconButton, Stack, Typography } from "@mui/material";
import { CaretLeft } from "@phosphor-icons/react";
import React from "react";
import ProfileForm from "../../sections/settings/ProfileForm";

const Profile = () => {
  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Box
          sx={{
            height: "100vh",
            backgroundColor: (them) =>
              them.palette.mode === "light"
                ? "F8FAFF"
                : them.palette.background,
            width: 320,
            boxShadow: "0px 0px 2px rgba(0,0,0,.25)",
          }}
        >
          <Stack p={4} spacing={5}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton>
                <CaretLeft size={24} color="#4B4B4B" />
              </IconButton>
              <Typography variant="h5">Profile</Typography>
            </Stack>
            <ProfileForm />
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default Profile;
