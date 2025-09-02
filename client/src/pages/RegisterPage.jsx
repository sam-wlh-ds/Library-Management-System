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

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setLoading, loading, setSnackbar, setCurrentPage } =
        useContext(AuthContext);
    const api = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await api.post("/register", { name, email, password });
        if (response && response.success) {
            setSnackbar({
                open: true,
                message: "Registration successful! Please log in.",
                severity: "success",
            });
            setCurrentPage("login");
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
                p: 4,
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid",
                borderColor: "divider",
                maxWidth: 500,
                mx: "auto",
            }}
        >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Register
            </Typography>
            <TextField
                label="Name"
                name="name"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2, maxWidth: 400 }}
            />
            <TextField
                label="Email Address"
                name="email"
                type="email"
                required
                fullWidth
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
                {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
            <Typography variant="body2">
                Already have an account?{" "}
                <Button onClick={() => setCurrentPage("login")}>
                    Login here
                </Button>
            </Typography>
        </Box>
    );
};

export default RegisterPage;
