import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import React from "react";

import { getUserInfo } from "../../redux/slices/auth";
import { useSelector } from "react-redux";

import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { useProfileContext } from "../../contexts/ProfileContext";
import { CaretLeft, Check, X } from "@phosphor-icons/react";

import { useNavigate } from "react-router-dom";
import ProfileForm from "../../components/profile/ProfileForm";

const VisuallyHiddenInput = ({ type, onChange }) => (
  <input
    type={type}
    style={{
      display: "none",
    }}
    onChange={onChange}
  />
);

const Profile = () => {
  const { firstName, lastName, avatar, phone, about, email } = useSelector(
    getUserInfo()
  );
  const {
    handleFileChange,
    handleImageChage,
    image,
    setImage,
    isSendingImage,
  } = useProfileContext();

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: (them) =>
          them.palette.mode === "light" ? "F8FAFF" : them.palette.background,
        width: "100%",
        boxShadow: "0px 0px 2px rgba(0,0,0,.25)",
      }}
    >
      <Stack p={4} spacing={5}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => navigate("/app")}>
            <CaretLeft size={24} color="#4B4B4B" />
          </IconButton>
          <Typography variant="h6">Profile</Typography>
        </Stack>

        <Stack
          spacing={5}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            spacing={3}
            alignItems="center"
            px={2}
            py={1}
            sx={{ maxWidth: "30rem" }}
          >
            <Stack
              position="relative"
              sx={{
                borderRadius: "100%",
                ":hover #button": {
                  opacity: 1,
                  transition: "opacity .5s ease",
                },
              }}
            >
              <Button
                id="button"
                component="label"
                disabled={isSendingImage}
                variant="contained"
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  opacity: 0,
                }}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>

              <Avatar
                sx={{
                  height: "20rem",
                  width: "20rem",
                  objectFit: "cover",
                }}
                src={image ? URL.createObjectURL(image) : avatar}
                alt="prifile image"
              />
              {image && (
                <Stack
                  spacing={2}
                  direction="row"
                  position="absolute"
                  sx={{
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <IconButton
                    disabled={isSendingImage}
                    onClick={handleImageChage}
                  >
                    <Check
                      size={52}
                      color={isSendingImage ? "#787878" : "#23c726"}
                      weight="fill"
                    />
                  </IconButton>
                  <IconButton
                    disabled={isSendingImage}
                    onClick={() => setImage(null)}
                  >
                    <X
                      size={52}
                      color={isSendingImage ? "#787878" : "#c93636"}
                      weight="fill"
                    />
                  </IconButton>
                </Stack>
              )}
            </Stack>

            <Stack spacing={2} p={1}>
              <Typography>
                <span style={{ fontWeight: 100 }}>Full name:</span>{" "}
                {`${firstName} ${lastName}`}
              </Typography>
              <Divider flexItem />
              <Typography>
                <span style={{ fontWeight: 100 }}>Email: </span>
                {email}
              </Typography>
              <Divider />
              <Typography>
                <span style={{ fontWeight: 100 }}>Phone numer:</span>{" "}
                {formatPhoneNumber(phone)}
              </Typography>
              <Divider flexItem />
              <Stack direction={"row"} justifyContent="start">
                <Typography sx={{ fontWeight: 100 }}>About:</Typography>&nbsp;
                <Typography>{about}</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Divider orientation="vertical" variant="middle" flexItem />

          <ProfileForm />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Profile;
