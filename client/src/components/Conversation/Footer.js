import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";

import {
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  File,
  Image,
} from "@phosphor-icons/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useRef } from "react";
import { useState } from "react";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
import {
  getConversations,
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));
const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 172,
    title: "Document",
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  handleMsgType,
  handleClickEnter,
}) => {
  const [openActions, setOpenActions] = useState(false);
  const { isLoading } = useSelector(getConversations());

  return (
    <StyledInput
      onKeyDown={handleClickEnter}
      disabled={isLoading}
      inputRef={inputRef}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: "max-content" }}>
            <Stack
              sx={{
                position: "relative",
                display: openActions ? "inline-block" : "none",
              }}
            >
              {Actions.map((el) => (
                <Tooltip placement="right" title={el.title} key={el.title}>
                  <Fab
                    onClick={() => {
                      setOpenActions(!openActions);
                      handleMsgType(el.title);
                    }}
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color,
                    }}
                    aria-label="add"
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>

            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setOpenActions(!openActions);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
    />
  );
};

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

const Footer = () => {
  const theme = useTheme();

  const { current_conversation: direct_current_conversation } = useSelector(
    getDirectConversations()
  );
  const { current_conversation: group_current_conversation } = useSelector(
    getGroupConversations()
  );

  const user_id = window.localStorage.getItem("user_id");

  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);

  const [openPicker, setOpenPicker] = React.useState(false);

  const [value, setValue] = useState("");
  const [type, setType] = useState("text");
  const inputRef = useRef(null);

  let current_conversation =
    chat_type === "OneToOne"
      ? direct_current_conversation
      : group_current_conversation;

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
          emoji +
          value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }
  // function linkify(text) {
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   return text.replace(
  //     urlRegex,
  //     (url) => `<a href="${url}" target="_blank">${url}</a>`
  //   );
  // }

  const handleClickEnter = (event) => {
    if (event.key === "Enter") {
      if (value.trim().length > 0) {
        dataToSend();
      }
    }
  };

  const dataToSend = () => {
    if (chat_type === "OneToOne") {
      socket.emit("text_message", {
        message: value,
        conversation_id: room_id,
        from: user_id,
        to: current_conversation.user_id,
        type: "msg",
        subtype:
          type === "text"
            ? value.startsWith("https://")
              ? "link"
              : "text"
            : type,
      });
    }
    if (chat_type === "OneToMany") {
      socket.emit("text_group_message", {
        message: value,
        conversation_id: room_id,
        from: user_id,
        to: current_conversation.user_id,
        type: "msg",
        subtype:
          type === "text"
            ? value.startsWith("https://")
              ? "link"
              : "text"
            : type,
      });
    }

    setType("text");
    setValue("");
  };

  const handleMsgType = (subtype) => {
    switch (subtype) {
      case "Photo/Video":
        return setType("img");
      case "Document":
        return setType("doc");
      default:
        setType("text");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                right: sideBar.open ? 420 : 100,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>

            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              handleMsgType={handleMsgType}
              handleClickEnter={handleClickEnter}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton
                onClick={() => {
                  if (value.trim().length > 0) {
                    dataToSend();
                  }
                }}
              >
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
