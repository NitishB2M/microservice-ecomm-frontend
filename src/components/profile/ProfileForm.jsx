import { Grid, Typography, TextField, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../context/ThemeContext';

const ProfileForm = ({ onProfileUpdate }) => {
	const { isDarkMode } = useTheme();
	const { 
		user: profile,
		updateProfile, 
		profileLoading, 
		profileError,  
		profileMessage, 
		setProfileError, 
		setProfileMessage,
	} = useProfile();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		// phone: '',
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (profile) {
			setFormData({
				firstName: profile.first_name,
				lastName: profile.last_name,
				email: profile.email,
				// phone: profile?.phone,
			});
		}
	}, [profile]);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.firstName) newErrors.firstName = 'First name is required';
		if (!formData.lastName) newErrors.lastName = 'Last name is required';
		if (!formData.email) newErrors.email = 'Email is required';
		// if (!formData.phone) newErrors.phone = 'Phone number is required';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const verifyDataModified = () => {
		return (
			formData.firstName !== profile.first_name ||
			formData.lastName !== profile.last_name ||
			formData.email !== profile.email
		);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	const textFieldComponent = (field) => {
		return (
			<TextField
				fullWidth
				label={field.label}
				name={field.name}
				value={field.value}
				onChange={handleChange}
				error={!!errors[field.name]}
				helperText={errors[field.name]}
				variant="outlined"
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
							borderColor: isDarkMode ? 'white' : '#0A6A47', // Border color on focus
							borderWidth: 2, // Make it thicker on focus (optional)
						},
					},
					"& .MuiInputLabel-root": {
						color: isDarkMode ? 'white' : 'black', // Change label color based on the theme
					},
					"& .MuiInputLabel-root.Mui-focused": {
						color: isDarkMode ? 'white' : '#0A6A47', // Change label color when the field is focused
					},
					"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: isDarkMode ? '#D79985' : '#0A6A47', // Change border color when the field is focused
						borderWidth: 2, // Make it thicker on focus (optional)
					},
					"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: isDarkMode ? '#D79985' : '#0A6A47',
						borderWidth: 2 // Change border color on hover
					},
				}}
			/>
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setProfileError('');
		setProfileMessage('');
		if (validateForm()) {
			if (!verifyDataModified()) {
				setProfileMessage('No changes made');
				return;
			}
			profile.first_name = formData.firstName;
			profile.last_name = formData.lastName;
			profile.email = formData.email;
			// profile.phone = formData.phone;
			const result = await updateProfile(profile);
			if (result.success) {
				onProfileUpdate();
			}
		}
	};

	const handleCancel = () => {
		setFormData({
			firstName: profile.first_name,
			lastName: profile.last_name,
			email: profile.email,
			phone: profile.phone,
		});
		setProfileError('');
		setProfileMessage('');
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Typography variant="h5" className="mb-2 font-semibold">
				Edit Your Profile
			</Typography>

			{profileError && <Grid item xs={12}><Alert severity="error" onClose={() => setProfileError('')}>{profileError}</Alert></Grid>}
			{profileMessage && <Grid item xs={12}><Alert severity="success" onClose={() => setProfileMessage('')}>{profileMessage}</Alert></Grid>}
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h6" className="mb-4">
						Basic Information
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					{textFieldComponent({
						label: 'First Name',
						name: 'firstName',
						value: formData.firstName,
						error: errors.firstName,
						helperText: errors.firstName,
						variant: 'outlined',
						focused: formData.firstName ? true : false,
						inputProps: { style: { color: isDarkMode ? '#ddd' : '#000' } }
					})}
				</Grid>
				<Grid item xs={12} md={6}>
					{textFieldComponent({
						label: 'Last Name',
						name: 'lastName',
						value: formData.lastName,
						error: errors.lastName,
						helperText: errors.lastName,
						variant: 'outlined',
						focused: formData.lastName ? true : false,
						inputProps: { style: { color: isDarkMode ? '#ddd' : '#000' } }
					})}
				</Grid>
				<Grid item xs={12} md={6}>
					{textFieldComponent({
						label: 'Email',
						name: 'email',
						value: formData.email,
						error: errors.email,
						helperText: errors.email,
						variant: 'outlined',
						focused: formData.email ? true : false,
						inputProps: { style: { color: isDarkMode ? '#ddd' : '#000' } }
					})}
				</Grid>
				<Grid item xs={12} md={6}>
					{textFieldComponent({
						label: 'Phone Number',
						name: 'phone',
						value: formData.phone,
						error: errors.phone,
						helperText: errors.phone,
						variant: 'outlined',
						disabled: true,
						focused: formData.phone ? true : false,
						inputProps: { style: { color: isDarkMode ? '#ddd' : '#000' } }
					})}
				</Grid>
			</Grid>

			<div className="flex justify-end gap-4 mt-6">
				<Button
					variant="outlined"
					color="error"
					onClick={handleCancel}
					startIcon={<CancelIcon />}
					className={`${!verifyDataModified() ? 'dark:!border-d-border/80 dark:!text-d-border' : ''}`}
					disabled={!verifyDataModified() || profileLoading}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					className={`${!verifyDataModified() ? 'dark:!bg-d-boxBg dark:!text-d-ctaText/40' : ''} `}
					disabled={profileLoading || !verifyDataModified()}
				>
					Save Changes
				</Button>
			</div>
		</form>
	)
};

export default ProfileForm