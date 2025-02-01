import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Paper, Typography, Button, Alert } from "@mui/material";
import { Label, Input, InputIcon } from "keep-react";
import { Lock } from "phosphor-react";
const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ message: "", details: [] });
  const [successMessage, setSuccessMessage] = useState("");
  const { resetPassword } = useAuth();

  const [token, setToken] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    setToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ message: "", details: [] });
    setSuccessMessage("");
    try {
      const result = await resetPassword(password, token);
      if (result.success) {
        setSuccessMessage(result.message);
        navigate("/login");
      } else {
        setError({
          message: result.error,
          details: result.errorDetails || [],
        });
      }
    } catch (error) {
      setError({
        message: error.message,
        details: error.details || [],
      });
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-[80vh] bg-background">
        <Paper className="p-8 w-full max-w-md text-l-ctaText mt-2 !bg-l-boxBg/10 dark:text-d-ctaText dark:bg-d-boxBg">
          <Typography variant="h5" component="h1" className="text-center !mb-6 font-bold text-l-primary dark:text-d-primary">
            New Password
          </Typography>

          {error.message && (
            <Alert severity="error" className="mb-4">
              {error.message}
              {error.details.length > 0 && (
                <ul className="mt-2 list-disc list-inside">
                  {error.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset className="space-y-1">
              <Label htmlFor="newpassword">New Password*</Label>
              <div className="relative">
                <Input
                  id="newpassword"
                  type="password"
                  name="newpassword"
                  placeholder="Enter new password"
                  className="ps-11 placeholder:text-l-primary/80"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <InputIcon>
                  <Lock size={19} color="#AFBACA" />
                </InputIcon>
              </div>
            </fieldset>

            <Button
              type="submit"
              variant="contained"
              className="bg-l-boxBg hover:bg-l-boxBg/80 dark:bg-d-boxBg dark:hover:bg-d-boxBg/80 w-full"
            >
              Submit
            </Button>
          </form>

          <div className="mt-4 flex justify-between items-center">
            <Link to="/login" className="text-c-info hover:text-c-info/80">
              Login
            </Link>
            <Link to="/signup" className="text-c-info hover:text-c-info/80">
              Sign up
            </Link>
          </div>
        </Paper>
      </div>

    </div>
  );
};

export default NewPassword;