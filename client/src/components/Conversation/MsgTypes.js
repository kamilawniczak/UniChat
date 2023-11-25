import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Download, DownloadSimple, Image, Smiley } from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";
import ImgModal from "./ImgModal";
import MessageOptions from "./MessageOptions";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../redux/slices/auth";
import MsgReaction from "./MsgReaction";
import EmojiPickerModal from "./EmojiPickerModal";

function getFileNameFromUrl(url) {
  const pathname = new URL(url).pathname;
  const match = pathname.match(/\$\$\$(.+)$/);
  return match ? match[1] : null;
}
function handleDownload(fileUrl) {
  const newWindow = window.open(fileUrl, "_blank");
  if (newWindow) {
    newWindow.opener = null;
  }
}
function handleMsgReaction(emiji) {
  console.log(emiji);

  // socket.emit(
  //   "reactToMsg",
  //   { msgId, chat_type, room_id: current_conversation.room_id, user_id },
  //   (data) => {}
  // );
}
const splitMessage = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = urlRegex.exec(message);

  if (match) {
    const link = match[0];
    const index = match.index;
    const textBeforeLink = message.slice(0, index).trim();
    const textAfterLink = message.slice(index + link.length).trim();

    return {
      textBeforeLink,
      textAfterLink,
      link,
    };
  }

  return {
    textBeforeLink: message,
    textAfterLink: "",
    link: null,
  };
};

export const MediaMsg = ({ data, menu, members }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const theme = useTheme();
  const { avatar } = useSelector(getUserInfo());
  const isLoading = data.file?.length > 0 && data.file[0] === "true";
  const member = members.find((mem) => mem.id === data.from);
  const otherAvatar = member?.avatar;

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };
  const handleDownloadClick = (event, img) => {
    event.stopPropagation();
    handleDownload(img);
  };
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <>
      <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
        {data.incoming && (
          <Stack alignItems="center" justifyContent="top" mr={1}>
            <Avatar
              alt="Avatar"
              src={otherAvatar}
              sx={{ width: 32, height: 32, marginLeft: 1 }}
            />
          </Stack>
        )}
        <Box
          p={1.5}
          sx={{
            backgroundColor: data.incoming
              ? theme.palette.background.default
              : theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Stack spacing={2}>
            {isLoading ? (
              <CircularProgress size={104} color="inherit" />
            ) : (
              <>
                {data.file.map((element, index) => (
                  <div
                    key={index}
                    style={{ position: "relative", display: "inline-block" }}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={element}
                      alt={getFileNameFromUrl(element) || element}
                      style={{
                        maxHeight: "210px",
                        borderRadius: "10px",
                      }}
                      onClick={() => handleImageClick(element)}
                    />
                    {hoveredIndex === index && (
                      <IconButton
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                        }}
                        onClick={(event) => handleDownloadClick(event, element)}
                      >
                        <Download />
                      </IconButton>
                    )}
                  </div>
                ))}
              </>
            )}
            {data.message && (
              <Typography
                variant="body2"
                color={data.incoming ? theme.palette.text : "#fff"}
              >
                {data.message}
              </Typography>
            )}
          </Stack>
        </Box>
        {menu && <MessageOptions msgId={data.id} incoming={data.incoming} />}
        {!data.incoming && (
          <Stack alignItems="center" justifyContent="top">
            <Avatar alt="Avatar" src={avatar} sx={{ width: 32, height: 32 }} />
          </Stack>
        )}
      </Stack>

      <ImgModal img={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
};
export const DocMsg = ({ data, menu, members }) => {
  const theme = useTheme();
  const { avatar } = useSelector(getUserInfo());
  const isLoading = data.file?.length > 0 && data.file[0] === "true";

  const member = members.find((mem) => mem.id === data.from);
  const otherAvatar = member?.avatar;

  return (
    <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
      {data.incoming && (
        <Stack alignItems="center" justifyContent="top" mr={1}>
          <Avatar
            alt="Avatar"
            src={otherAvatar}
            sx={{ width: 32, height: 32, marginLeft: 1 }}
          />
        </Stack>
      )}
      <Box
        p={1.5}
        sx={{
          backgroundColor: data.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
        }}
      >
        <Stack spacing={2}>
          {isLoading ? (
            <CircularProgress size={104} color="inherit" />
          ) : (
            <>
              {data.file.map((element, index) => (
                <Stack
                  p={2}
                  direction="row"
                  spacing={3}
                  alignItems="center"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                  }}
                  key={index}
                >
                  <Image size={48} />
                  <Typography
                    variant="caption"
                    sx={{ color: data.incoming ? theme.palette.text : "#FFF" }}
                  >
                    {getFileNameFromUrl(element)}
                  </Typography>
                  <IconButton onClick={() => handleDownload(element)}>
                    <DownloadSimple />
                  </IconButton>
                </Stack>
              ))}
            </>
          )}

          <Typography
            variant="body2"
            sx={{ color: data.incoming ? theme.palette.text : "#FFF" }}
          >
            {data.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions msgId={data.id} incoming={data.incoming} />}
      {!data.incoming && (
        <Stack alignItems="center" justifyContent="top">
          <Avatar alt="Avatar" src={avatar} sx={{ width: 32, height: 32 }} />
        </Stack>
      )}
    </Stack>
  );
};

export const ReplayMsg = ({ data, menu, members }) => {
  const theme = useTheme();
  const { avatar } = useSelector(getUserInfo());
  const member = members.find((mem) => mem.id === data.from);
  const otherAvatar = member?.avatar;
  return (
    <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
      {data.incoming && (
        <Stack alignItems="center" justifyContent="top" mr={1}>
          <Avatar
            alt="Avatar"
            src={otherAvatar}
            sx={{ width: 32, height: 32, marginLeft: 1 }}
          />
        </Stack>
      )}
      <Box
        p={1.5}
        sx={{
          backgroundColor: data.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {data.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={data.incoming ? theme.palette.text : "#FFF"}
          >
            {data.reply}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions msgId={data.id} incoming={data.incoming} />}
      {!data.incoming && (
        <Stack alignItems="center" justifyContent="top">
          <Avatar alt="Avatar" src={avatar} sx={{ width: 32, height: 32 }} />
        </Stack>
      )}
    </Stack>
  );
};

export const TextMsg = ({ data, menu, members }) => {
  // const [openPicker, setOpenPicker] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const { avatar } = useSelector(getUserInfo());
  const { textBeforeLink, textAfterLink, link } = splitMessage(data.message);

  const member = members.find((mem) => mem.id === data.from);
  const otherAvatar = member?.avatar;

  const handleOpenPicker = () => {
    setOpenModal(true);
  };

  const handleClosePicker = () => {
    setOpenModal(false);
  };

  return (
    <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
      {data.incoming && (
        <Stack alignItems="center" justifyContent="top" mr={1}>
          <Avatar
            alt="Avatar"
            src={otherAvatar}
            sx={{ width: 32, height: 32, marginLeft: 1 }}
          />
        </Stack>
      )}
      <Stack>
        <Box
          p={1.5}
          sx={{
            backgroundColor: data.incoming
              ? theme.palette.background.default
              : theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Typography
            variant="body2"
            color={data.incoming ? theme.palette.text : "#fff"}
          >
            {link ? (
              <>
                {textBeforeLink}{" "}
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: data.incoming ? theme.palette.text : "#fff",
                  }}
                >
                  {link}
                </a>{" "}
                {textAfterLink}
              </>
            ) : (
              data.message
            )}
          </Typography>
        </Box>
        <MsgReaction />
      </Stack>

      <EmojiPickerModal
        open={openModal}
        onClose={handleClosePicker}
        onEmojiSelect={(emoji) => {
          handleMsgReaction(emoji.native);
          handleClosePicker();
        }}
      />

      {menu && (
        <MessageOptions
          msgId={data.id}
          incoming={data.incoming}
          openPicker={handleOpenPicker}
        />
      )}
      {!data.incoming && (
        <Stack alignItems="center" justifyContent="top">
          <Avatar alt="Avatar" src={avatar} sx={{ width: 32, height: 32 }} />
        </Stack>
      )}
    </Stack>
  );
};

export const Timeline = ({ data, menu }) => {
  const theme = useTheme();
  return (
    <Stack>
      <Divider width="4%">
        <Typography variant="caption" sx={{ color: theme.palette.text }}>
          {data?.text}
        </Typography>
      </Divider>
    </Stack>
  );
};
