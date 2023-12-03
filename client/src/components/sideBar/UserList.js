import { Autocomplete, Button, Stack, TextField } from "@mui/material";

const UserList = ({ users, selectedUserIndex, setSelectedUserIndex }) => {
  const handleUserSelect = (e, value) => {
    if (value && value.id) {
      const selectedIndex = users?.findIndex((user) => user.id === value.id);

      if (selectedIndex !== -1 && selectedIndex !== null) {
        setSelectedUserIndex(selectedIndex);
      }
    }
  };

  const handlePrevUser = () => {
    setSelectedUserIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : users.length - 1
    );
  };

  const handleNextUser = () => {
    setSelectedUserIndex((prevIndex) =>
      prevIndex < users.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <Stack open={!!users?.length}>
      <Autocomplete
        options={users}
        getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
        value={users[selectedUserIndex]}
        onChange={handleUserSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select User"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={handlePrevUser} disabled={users.length <= 1}>
          Previous
        </Button>
        <Button onClick={handleNextUser} disabled={users.length <= 1}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
};

export default UserList;
