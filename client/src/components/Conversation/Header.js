import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CaretDown,
  MagnifyingGlass,
  PhoneIncoming,
  VideoCamera,
} from "@phosphor-icons/react";
import React from "react";
import StyledBadge from "../../components/StyledBadge";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import { getDirectConversations } from "../../redux/slices/conversation";

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { current_conversation } = useSelector(getDirectConversations());
  const { userInfo } = current_conversation;
  const { name, online } = userInfo;
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FaFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
      p={2}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          direction="row"
          spacing={2}
          onClick={() => dispatch(ToggleSidebar())}
        >
          <Box>
            {online ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={faker.name.fullName()}
                  src={faker.image.avatar()}
                />
              </StyledBadge>
            ) : (
              <Avatar alt={faker.name.fullName()} src={faker.image.avatar()} />
            )}
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="capiton">
              {online ? "Online" : "Offline"}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={3}>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
