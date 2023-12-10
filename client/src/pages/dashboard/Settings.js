import React from "react";
import { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { CaretLeft, EnvelopeSimple, Trash } from "@phosphor-icons/react";
import RemoveUser from "../../components/settingsPage/RemoveUser";
import ChangeEmail from "../../components/settingsPage/ChangeEmail";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const theme = useTheme();
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const [openChangeEmail, setOpenChangeEmail] = useState(false);

  const navigate = useNavigate();

  const list = [
    {
      key: 0,
      icon: <Trash size={20} />,
      title: "Remove your accout",
      onClick: () => {
        setOpenDeleteUserModal(true);
      },
    },
    {
      key: 1,
      icon: <EnvelopeSimple size={20} />,
      title: "Change your email",
      onClick: () => {
        setOpenChangeEmail(true);
      },
    },
  ];

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Box
          sx={{
            overflowY: "scroll",
            height: "100vh",
            width: 320,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          }}
        >
          <Stack spacing={5} p={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton onClick={() => navigate("/app")}>
                <CaretLeft size={24} color="#4B4B4B" />
              </IconButton>
              <Typography variant="h6">Settings</Typography>
            </Stack>

            <Stack spacing={4}>
              {list.map(({ key, icon, title, onClick }) => (
                <Stack
                  sx={{ cursor: "pointer" }}
                  spacing={2}
                  onClick={onClick}
                  key={key}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {icon}
                    <Typography variant="body2">{title}</Typography>
                  </Stack>
                  {key !== list.length - 1 && <Divider />}
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>
        <Box></Box>
      </Stack>
      <RemoveUser
        open={openDeleteUserModal}
        handleClose={() => setOpenDeleteUserModal(false)}
      />
      <ChangeEmail
        open={openChangeEmail}
        handleClose={() => setOpenChangeEmail(false)}
      />
    </>
  );
};

export default Settings;
