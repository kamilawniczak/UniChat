import { Avatar, Badge, Box, Stack, Typography, useTheme } from "@mui/material";
import StyledBadge from "./StyledBadge";
import { useDispatch } from "react-redux";
import { SelectRoom } from "../redux/slices/app";
import { SetConversation } from "../redux/slices/conversation";

const checkMessage = (message) => {
  if (message.length < 20) return message;
  return message.split("").slice(0, 20).join("") + "...";
};

const ChatElement = ({ id, name, img, msg, time, unread, online, user_id }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#FFF"
            : theme.palette.background.paper,
      }}
      p={1.4}
      onClick={() => {
        dispatch(SetConversation({ user_id, room_id: id }));
        dispatch(SelectRoom({ room_id: id }));
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={img} />
            </StyledBadge>
          ) : (
            <Avatar src={img} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>{" "}
            <Typography variant="caption">{checkMessage(msg)}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread} />
        </Stack>
      </Stack>
    </Box>
  );
};
export default ChatElement;
