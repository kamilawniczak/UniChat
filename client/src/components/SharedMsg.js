import {
  Box,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";

import { CaretLeft, DownloadSimple, Image } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateSidebarType, getChatType } from "../redux/slices/app";
import { faker } from "@faker-js/faker";
import { SHARED_DOCS } from "../data";
import { DocMsg } from "./Conversation/MsgTypes";
import {
  getDirectConversations,
  getGroupConversations,
} from "../redux/slices/conversation";
import { getFileNameFromUrl, handleDownload } from "../utils/formatMsg";

const SharedMsg = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const chat_type = useSelector(getChatType());
  const direct_msgs = useSelector(getDirectConversations()).current_meessages;
  const group_msgs = useSelector(getGroupConversations()).current_meessages;

  let current_meessages = [];
  if (chat_type === "OneToOne") {
    current_meessages = direct_msgs;
  }
  if (chat_type === "OneToMany") {
    current_meessages = group_msgs;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectedOption = (value) => {
    switch (value) {
      case 0:
        const images = current_meessages
          ?.filter((msg) => msg.subtype === "img")
          ?.reduce((acc, curr) => {
            if (curr.file.length === 1) {
              acc.push(curr.file[0]);
            } else if (curr.file.length > 1) {
              acc.push(...curr.file.map((file) => file));
            }
            return acc;
          }, []);

        return (
          <Grid container spacing={2}>
            {images.map((e) => (
              <Grid item xs={4} key={e}>
                <img src={e} alt={e} />
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        const documents = current_meessages
          ?.filter((msg) => msg.subtype === "doc")
          ?.reduce((acc, curr) => {
            if (curr.file.length === 1) {
              acc.push(curr.file[0]);
            } else if (curr.file.length > 1) {
              acc.push(...curr.file.map((file) => file));
            }
            return acc;
          }, []);

        return documents.map((element) => (
          <Stack
            p={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : theme.palette.secondary.lighter,
              borderRadius: 1,
            }}
            key={element}
          >
            <Typography
              variant="caption"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                // color: data.incoming ? theme.palette.text : "#FFF",
              }}
            >
              {getFileNameFromUrl(element)}
            </Typography>
            <IconButton onClick={() => handleDownload(element)}>
              <DownloadSimple />
            </IconButton>
          </Stack>
        ));

      default:
        return;
    }
  };

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }} alignItems="center">
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            direction="row"
            sx={{ height: "100%" }}
            p={2}
            alignItems="center"
          >
            <IconButton onClick={() => dispatch(UpdateSidebarType("CONTACT"))}>
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">Shared Messages</Typography>
          </Stack>
        </Box>
        <Tabs value={value} onChange={handleChange} sx={{ px: 2, pt: 2 }}>
          <Tab label="Media" />
          <Tab label="Docs" />
        </Tabs>
        <Stack
          sx={{
            height: "100%",
            width: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >
          {handleSelectedOption(value)}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SharedMsg;
