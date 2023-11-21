import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DotsThreeVertical,
  DownloadSimple,
  Image,
} from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";
import { Message_options } from "../../data";
import ImgModal from "./ImgModal";

export const MediaMsg = ({ data, menu }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const theme = useTheme();

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const isLoading = data.file?.length > 0 && data.file[0] === "true";
  return (
    <>
      <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
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
                  <img
                    src={element}
                    alt={element}
                    style={{
                      maxHeight: "210px",
                      borderRadius: "10px",
                    }}
                    onClick={() => handleImageClick(element)}
                    key={index}
                  />
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
        {menu && <MessageOptions />}
      </Stack>

      <ImgModal img={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
};
export const DocMsg = ({ data, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
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
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography
              variant="caption"
              sx={{ color: data.incoming ? theme.palette.text : "#FFF" }}
            >
              Abstract.png
            </Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: data.incoming ? theme.palette.text : "#FFF" }}
          >
            {data.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions />}
    </Stack>
  );
};

export const ReplayMsg = ({ data, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

const splitMessage = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = urlRegex.exec(message);

  if (match) {
    console.log(match);
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

export const TextMsg = ({ data, menu }) => {
  const theme = useTheme();
  const { textBeforeLink, textAfterLink, link } = splitMessage(data.message);
  return (
    <Stack direction="row" justifyContent={data.incoming ? "start" : "end"}>
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
      {menu && <MessageOptions />}
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

function MessageOptions() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="menu-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((e, i) => (
            <MenuItem onClick={handleClose} key={i}>
              {e.title}
            </MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
}
