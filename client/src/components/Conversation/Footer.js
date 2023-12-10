import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";

import { PaperPlaneTilt, XCircle } from "@phosphor-icons/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useRef } from "react";
import { useState } from "react";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import { OpenSnackBar } from "../../redux/slices/app";

import { useReplayMsgContext } from "../../contexts/ReplyMsgContext";
import MessageAnnotation from "./MessageAnnotation";
import ChatInput from "../ChatInput";
import { supabase } from "../../utils/supabase";

const Footer = () => {
  const [fileInput, setFilesInput] = useState([]);
  const [openPicker, setOpenPicker] = React.useState(false);
  const [openActions, setOpenActions] = useState(false);

  const theme = useTheme();
  const { replyMsgId, replyType, onResetMsgId, replyText, replyFile } =
    useReplayMsgContext();

  const { current_conversation: direct_current_conversation } = useSelector(
    getDirectConversations()
  );
  const { current_conversation: group_current_conversation } = useSelector(
    getGroupConversations()
  );

  const user_id = window.localStorage.getItem("user_id");

  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);

  const [value, setValue] = useState("");
  const [type, setType] = useState("text");
  const inputRef = useRef(null);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

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

      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const handleClickEnter = (event) => {
    if (event.key === "Enter") {
      if (value.trim().length > 0) {
        dataToSend();
      }
    }
  };

  const sendFile = async (dataToSend) => {
    try {
      dataToSend.files = await Promise.all(
        dataToSend.files.map(async (file) => {
          const token =
            user_id +
            "/" +
            Date.now() +
            crypto.randomUUID() +
            "$$$" +
            file.name;
          await supabase.storage.from("files").upload(token, file);

          return `https://aywtluyvoneczbqctdfk.supabase.co/storage/v1/object/public/files/${token}`;
        })
      );

      await socket.emit("upload-file", dataToSend);
    } catch (error) {
      console.log(error);
    }
  };

  const dataToSend = async () => {
    const filesToSend = fileInput;

    const messageData = {
      message: value,
      conversation_id: room_id,
      from: user_id,
      to: current_conversation.user_id,
      type: "msg",
      subtype:
        type === "text" ? "text" : filesToSend.length === 0 ? "text" : type,
      file: filesToSend.length > 0 && true,
      reply: replyMsgId || null,
      replyType: replyType || "text",
    };

    if (chat_type === "OneToOne") {
      socket.emit("text_message", messageData, (msgId) => {
        if (filesToSend.length !== 0) {
          const data = {
            room_id,
            msgId,
            files: filesToSend,
            chat_type,
          };

          sendFile(data);
        }
      });
    }
    if (chat_type === "OneToMany") {
      socket.emit("text_group_message", messageData, (msgId) => {
        if (filesToSend.length !== 0) {
          const data = {
            room_id,
            msgId,
            files: filesToSend,
            chat_type,
          };
          sendFile(data);
        }
      });
    }

    setType("text");
    setValue("");
    setFilesInput([]);
    setOpenPicker(false);
    onResetMsgId();
    setOpenActions(false);
  };

  const handleMsgType = (subtype) => {
    switch (subtype) {
      case "Photo/Video":
        fileInputRef.current.click();
        return setType("img");
      case "Document":
        fileInputRef.current.click();
        return setType("doc");
      default:
        setType("text");
    }
  };

  const handleFileChange = (event) => {
    console.log("Wow");
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length > 10) {
      dispatch(
        OpenSnackBar({
          severity: "warning",
          message: "Too many files :( max 10",
        })
      );
      return;
    }

    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

    const maxSizeInBytes = 40 * 1024 * 1024;

    if (totalSize > maxSizeInBytes) {
      dispatch(
        OpenSnackBar({
          severity: "warning",
          message: `Total size exceeds 40MB, currently ${Math.round(
            totalSize / (1024 * 1024)
          )} MB`,
        })
      );
      return;
    }

    setFilesInput(selectedFiles);
  };

  const removeFile = (index) => {
    setFilesInput((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
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
                zIndex: 20,
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
            <Box
              sx={{ display: "flex", gap: 1 }}
              style={{
                zIndex: 10,
                position: "fixed",
                bottom: 71,
                left: 430,
              }}
            >
              <Stack>
                <Stack direction="row" spacing={1}>
                  {fileInput?.length > 0 &&
                    fileInput.map((file, index) => (
                      <Stack key={index} direction="row">
                        <Tooltip
                          placement="top"
                          title={file.name}
                          sx={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <Avatar
                            alt="Selected Photo"
                            src={URL.createObjectURL(file)}
                            sx={{ width: 52, height: 52, borderRadius: "8px" }}
                          />
                        </Tooltip>
                        <Stack position="relative">
                          <IconButton
                            sx={{
                              zIndex: 10,
                              position: "absolute",
                              top: 0,
                              right: 0,
                              margin: 0,
                              padding: 0.1,
                              transform: "translate(40%, -40%)",
                              backgroundColor:
                                theme.palette.mode === "light"
                                  ? "#F8FAFF"
                                  : theme.palette.background.paper,
                            }}
                            onClick={() => removeFile(index)}
                          >
                            <XCircle size={20} color="#c42121" weight="light" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    ))}
                </Stack>
                {replyMsgId && (
                  <MessageAnnotation
                    type={replyType}
                    file={replyFile}
                    text={replyText}
                    onReset={onResetMsgId}
                  />
                )}
              </Stack>
            </Box>
            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              handleMsgType={handleMsgType}
              handleClickEnter={handleClickEnter}
              handleActions={setOpenActions}
              openActions={openActions}
            />

            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
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
                  if (value.trim().length > 0 || fileInput.length > 0) {
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
