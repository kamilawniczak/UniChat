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
import { Download, DownloadSimple } from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";
import ImgModal from "./ImgModal";
import MessageOptions from "./MessageOptions";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../redux/slices/auth";
import MsgReaction from "./MsgReaction";
import EmojiPickerModal from "./EmojiPickerModal";
import { ReplyFile, ReplyTextMsg } from "./ReplyMsgTypes";
import {
  getFileNameFromUrl,
  handleDownload,
  handleMsgReaction,
  splitMessage,
} from "../../utils/formatMsg";
import { isImage } from "../../utils/checkFile";

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
        <ReplyFile
          created_at={created_at}
          file={replyFile}
          from={replyFrom}
          text={replyText}
          type={replyType}
        />
      );
    case "doc":
      return (
        <ReplyFile
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

export const TextMsg = ({
  data,
  menu,
  members = [],
  room_id,
  conversationType,
  showAvatar,
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
    <Stack alignItems={"center"}>
      <Typography
        variant={"subtitle1"}
        sx={{ fontSize: 11 }}
        // sx={{ position: "absolute", top: -20, zIndex: 20 }}
      >
        {new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(data.created_at))}
      </Typography>
      <Stack
        direction="row"
        justifyContent={data.incoming ? "start" : "end"}
        width={"100%"}
      >
        {data.incoming && showAvatar && (
          <Stack alignItems="center" justifyContent="top" mr={1}>
            <Avatar
              alt="Avatar"
              src={otherAvatar}
              sx={{ width: 32, height: 32, marginLeft: 1 }}
            />
          </Stack>
        )}
        <Stack sx={{ position: "relative" }}>
          <Stack
            alignItems={data.incoming ? "flex-start" : "flex-end"}
            sx={{ position: "relative" }}
            direction={"column"}
            width={"100%"}
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
                width: "100%",
                backgroundColor: data.incoming
                  ? theme.palette.background.default
                  : theme.palette.primary.main,
                borderRadius: 1.5,
                border:
                  !showAvatar &&
                  data.incoming &&
                  "1px solid " + theme.palette.grey[600],
              }}
            >
              <Typography
                variant="body2"
                color={data.incoming ? theme.palette.text : "#fff"}
                width={"100%"}
                sx={{ overflowWrap: "anywhere" }}
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
          <Stack>
            <MessageOptions
              msgId={data.id}
              incoming={data.incoming}
              openPicker={handleOpenPicker}
              data={data}
            />
          </Stack>
        )}

        {!data.incoming && showAvatar && (
          <Stack alignItems="center" justifyContent="top">
            <Avatar alt="Avatar" src={avatar} sx={{ width: 32, height: 32 }} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export const FileMsg = ({
  data,
  menu,
  members = [],
  room_id,
  conversationType,
  showAvatar,
  small,
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
      <Stack>
        {data.created_at && (
          <Typography
            variant={"subtitle1"}
            sx={{ fontSize: 11 }}
            alignSelf="center"
          >
            {new Intl.DateTimeFormat("en-US", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(data.created_at))}
          </Typography>
        )}
        <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
          {data.incoming && showAvatar && (
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
                  border:
                    !showAvatar &&
                    data.incoming &&
                    "1px solid " + theme.palette.grey[600],
                }}
              >
                <Stack spacing={2} alignItems="end">
                  {isLoading ? (
                    <CircularProgress size={104} color="inherit" />
                  ) : (
                    <>
                      {data.file.map((element, index) =>
                        isImage(element) ? (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
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
                        ) : (
                          <Stack
                            p={2}
                            direction="row"
                            spacing={3}
                            alignItems="center"
                            justifyContent={"end"}
                            sx={{
                              width: "min-content",
                              backgroundColor: theme.palette.background.paper,
                              borderRadius: 1,
                            }}
                            key={index}
                          >
                            {small || (
                              <Avatar
                                src={`https://pro.alchemdigital.com/api/extension-image/${element
                                  .split(".")
                                  .pop()
                                  .toLowerCase()}`}
                                alt={element}
                                variant="square"
                              />
                            )}

                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text,
                                ...(small
                                  ? {
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                    }
                                  : {}),
                              }}
                            >
                              {getFileNameFromUrl(element)}
                            </Typography>
                            <IconButton onClick={() => handleDownload(element)}>
                              <DownloadSimple />
                            </IconButton>
                          </Stack>
                        )
                      )}
                    </>
                  )}
                  {data.message && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: data.incoming ? theme.palette.text : "#FFF",
                      }}
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

          {!data.incoming && showAvatar && (
            <Stack alignItems="center" justifyContent="top">
              <Avatar
                alt="Avatar"
                src={avatar}
                sx={{ width: 32, height: 32 }}
              />
            </Stack>
          )}
        </Stack>
      </Stack>

      <ImgModal img={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
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
