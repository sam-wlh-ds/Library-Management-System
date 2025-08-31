import React, { useState, useContext } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { AuthContext } from "../lib/AuthContext";
import useApi from "../api/useApi";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser, setLoading, loading, setSnackbar, setCurrentPage } =
        useContext(AuthContext);
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await api.post("/login", { email, password });
        if (response && response.token && response.user) {
            localStorage.setItem("token", response.token);

            const userResponse = await api.get(
                `/api/users/${response.user._id}/dashboard`
            );

            if (userResponse) {
                localStorage.setItem("user", JSON.stringify(userResponse));
                setUser(userResponse);
                setSnackbar({
                    open: true,
                    message: "Logged in successfully!",
                    severity: "success",
                });
                setCurrentPage("dashboard");
            }
        }
        setLoading(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                mt: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Login
            </Typography>
            <TextField
                label="Email Address"
                name="email"
                required
                fullWidth
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, maxWidth: 400 }}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                required
                fullWidth
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2, maxWidth: 400 }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mb: 2, maxWidth: 400 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            <Typography variant="body2">
                Don't have an account?{" "}
                <Button onClick={() => setCurrentPage("register")}>
                    Register here
                </Button>
            </Typography>
        </Box>
    );
};

export default LoginPage;
