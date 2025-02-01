import { TextField } from '@mui/material';

const TextFieldComponent = (field, isDarkMode) => {
    return (
        <TextField
            fullWidth
            label={field.label}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            error={!!field.error}
            helperText={field.error}
            variant="outlined"
            disabled={field.disabled}
            // focused={field.value ? true : false}
            inputProps={{ style: { color: isDarkMode ? '#ddd' : '#000' } }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    // Styling the fieldset (outline) on focus
                    "& fieldset": {
                        borderColor: isDarkMode ? 'white' : 'black', // Default border color
                    },
                    // Focused state of the fieldset (outline)
                    "&.Mui-focused fieldset": {
                        borderColor: isDarkMode ? 'yellow' : 'blue', // Border color on focus
                        borderWidth: 2, // Make it thicker on focus (optional)
                    },
                },
                "& .MuiInputLabel-root": {
                    color: isDarkMode ? 'white' : 'black', // Change label color based on the theme
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: isDarkMode ? 'yellow' : '#0A6A47', // Change label color when the field is focused
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDarkMode ? 'yellow' : '#0A6A47', // Change border color when the field is focused
                    borderWidth: 2, // Make it thicker on focus (optional)
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDarkMode ? 'yellow' : '#0A6A47',
                    borderWidth: 2 // Change border color on hover
                },
            }}
        />
    );
};

export { TextFieldComponent };