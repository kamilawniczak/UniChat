import { Avatar, Stack, Typography } from "@mui/material";

const UserCard = ({ user }) => {
  const { firstName, lastName, avatar, phone, email } = user;

  return (
    <Stack alignItems="center" direction="column" spacing={2}>
      <Avatar src={avatar} alt={firstName} sx={{ height: 154, width: 154 }} />
      <Stack spacing={0.5} alignItems="center">
        <Typography variant="article" fontWeight={600}>
          {`${firstName} ${lastName}`}
        </Typography>
        <Typography variant="article" fontWeight={600}>
          {phone || "*** *** ***"}
        </Typography>
        {email && (
          <Typography variant="article" fontWeight={600}>
            {email}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default UserCard;
