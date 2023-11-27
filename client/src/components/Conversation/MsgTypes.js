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
import { Download, DownloadSimple, Image } from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";
import ImgModal from "./ImgModal";
import MessageOptions from "./MessageOptions";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../redux/slices/auth";
import MsgReaction from "./MsgReaction";
import EmojiPickerModal from "./EmojiPickerModal";
import { ReplyDocMsg, ReplyImgMsg, ReplyTextMsg } from "./ReplyMsgTypes";
import {
  getFileNameFromUrl,
  handleDownload,
  handleMsgReaction,
  splitMessage,
} from "../../utils/formatMsg";

const replayMsg = (
  type,
  { created_at, replyFile, replyText, replyFrom, replyType }
) => {
  switch (type) {
    case "text":
      return (
        <ReplyTextMsg
          created_at={created_at}
          file={replyFile}
          from={replyFrom}
          text={replyText}
          type={replyType}
        />
      );
    case "img":
      return (
        <ReplyImgMsg
          created_at={created_at}
          file={replyFile}
          from={replyFrom}
          text={replyText}
          type={replyType}
        />
      );
    case "doc":
      return (
        <ReplyDocMsg
          created_at={created_at}
          file={replyFile}
          from={replyFrom}
          text={replyText}
          type={replyType}
        />
      );
    default:
      return null;
  }
};

export const MediaMsg = ({
  data,
  menu,
  members = [],
  room_id,
  conversationType,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const theme = useTheme();
  const {
    created_at,
    file: replyFile,
    from: replyFrom,
    text: replyText,
    type: replyType,
  } = data.replyData || {};
  const { textBeforeLink, textAfterLink, link } = splitMessage(data.message);
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

  const handleOpenPicker = () => {
    setOpenModal(true);
  };

  const handleClosePicker = () => {
    setOpenModal(false);
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
        <Stack>
          <Stack alignItems={data.incoming ? "start" : "end"}>
            {data.replyData &&
              replayMsg(data.replyData.type, {
                created_at,
                replyFile,
                replyText,
                replyFrom,
                replyType,
              })}
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
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
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
                            onClick={(event) =>
                              handleDownloadClick(event, element)
                            }
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
                    sx={{ color: data.incoming ? theme.palette.text : "#FFF" }}
                  >
                    {link ? (
                      <>
                        {textBeforeLink}{" "}
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#fff",
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
                )}
              </Stack>
            </Box>
          </Stack>
          <MsgReaction reactions={data.reaction} />
        </Stack>

        <EmojiPickerModal
          open={openModal}
          onClose={handleClosePicker}
          onEmojiSelect={(emoji) => {
            handleMsgReaction({
              emoji: emoji.native,
              id: data.id,
              room_id,
              chatType: conversationType,
            });
            handleClosePicker();
          }}
        />
        {menu && (
          <MessageOptions
            msgId={data.id}
            incoming={data.incoming}
            openPicker={handleOpenPicker}
            type={"img"}
            data={data}
          />
        )}

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
export const DocMsg = ({
  data,
  menu,
  members = [],
  room_id,
  conversationType,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const { avatar } = useSelector(getUserInfo());

  const {
    created_at,
    file: replyFile,
    from: replyFrom,
    text: replyText,
    type: replyType,
  } = data.replyData || {};
  const { textBeforeLink, textAfterLink, link } = splitMessage(data.message);
  const isLoading = data.file?.length > 0 && data.file[0] === "true";

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
        <Stack alignItems={data.incoming ? "start" : "end"}>
          {data.replyData &&
            replayMsg(data.replyData.type, {
              created_at,
              replyFile,
              replyText,
              replyFrom,
              replyType,
            })}
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
                        sx={{
                          color: data.incoming ? theme.palette.text : "#FFF",
                        }}
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

              {data.message && (
                <Typography
                  variant="body2"
                  sx={{ color: data.incoming ? theme.palette.text : "#FFF" }}
                >
                  {link ? (
                    <>
                      {textBeforeLink}{" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#fff",
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
              )}
            </Stack>
          </Box>
        </Stack>
        <MsgReaction reactions={data.reaction} />
      </Stack>
      <EmojiPickerModal
        open={openModal}
        onClose={handleClosePicker}
        onEmojiSelect={(emoji) => {
          handleMsgReaction({
            emoji: emoji.native,
            id: data.id,
            room_id,
            chatType: conversationType,
          });
          handleClosePicker();
        }}
      />
      {menu && (
        <MessageOptions
          msgId={data.id}
          incoming={data.incoming}
          openPicker={handleOpenPicker}
          type={"doc"}
          data={data}
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

export const TextMsg = ({
  data,
  menu,
  members = [],
  room_id,
  conversationType,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const { avatar } = useSelector(getUserInfo());
  const { textBeforeLink, textAfterLink, link } = splitMessage(data.message);
  const {
    created_at,
    file: replyFile,
    from: replyFrom,
    text: replyText,
    type: replyType,
  } = data.replyData || {};

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
        <Stack
          alignItems={data.incoming ? "flex-start" : "flex-end"}
          sx={{ position: "relative" }}
          direction={"column"}
        >
          {data.replyData &&
            replayMsg(data.replyData.type, {
              created_at,
              replyFile,
              replyText,
              replyFrom,
              replyType,
            })}
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
        </Stack>
        <MsgReaction reactions={data.reaction} />
      </Stack>

      <EmojiPickerModal
        open={openModal}
        onClose={handleClosePicker}
        onEmojiSelect={(emoji) => {
          handleMsgReaction({
            emoji: emoji.native,
            id: data.id,
            room_id,
            chatType: conversationType,
          });
          handleClosePicker();
        }}
      />

      {menu && (
        <MessageOptions
          msgId={data.id}
          incoming={data.incoming}
          openPicker={handleOpenPicker}
          data={data}
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
