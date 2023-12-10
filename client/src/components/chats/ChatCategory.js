import {
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import { useState } from "react";
import ChatElement from "./ChatElement";
import { useTheme } from "@emotion/react";

const ChatCategory = ({
  title,
  conversations,
  isLoading,
  defaultOpen = false,
  isGroupChat,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const theme = useTheme();
  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        onClick={handleToggle}
        sx={{
          padding: "0.2rem 1rem",
          borderRadius: 1.5,

          "&: hover": {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "#676767" }}>
          {title}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#676767" }}>
          <IconButton sx={{ padding: 0 }}>
            {isOpen ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
          </IconButton>
        </Typography>
      </Stack>

      {/* {isLoading &&  */}

      <Collapse in={isOpen}>
        {isLoading ? (
          <Stack alignItems="center">
            <CircularProgress color="success" />
          </Stack>
        ) : (
          <Stack spacing={2.4}>
            {conversations.length === 0 && (
              <Typography variant="subtitle2">No Chats</Typography>
            )}
            {conversations.map((e) => (
              <ChatElement {...e} key={e.id} isGroupChat={isGroupChat} />
            ))}
          </Stack>
        )}
      </Collapse>
    </Stack>
  );
};

export default ChatCategory;
