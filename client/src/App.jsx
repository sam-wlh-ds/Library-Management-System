import React, { useContext, useEffect } from "react";
import {
    Container,
    Box,
    Snackbar,
    Alert,
    ThemeProvider,
    CssBaseline,
} from "@mui/material";
import { AuthContext, AuthProvider } from "./lib/AuthContext";
import theme from "./theme";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BrowseBooksPage from "./pages/BrowseBookPage";

const AppContent = () => {
    const {
        user,
        setUser,
        snackbar,
        setSnackbar,
        currentPage,
        setCurrentPage,
    } = useContext(AuthContext);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setCurrentPage("dashboard");
        }
    }, [setUser, setCurrentPage]);

    const onLogout = () => {
        localStorage.clear();
        setUser(null);
        setCurrentPage("login");
        setSnackbar({
            open: true,
            message: "Logged out successfully.",
            severity: "success",
        });
    };

    const renderPage = () => {
        switch (currentPage) {
            case "login":
                return <LoginPage />;
            case "register":
                return <RegisterPage />;
            case "dashboard":
                return user ? <DashboardPage /> : <LoginPage />;
            case "browse":
                return user ? <BrowseBooksPage /> : <LoginPage />;
            default:
                return <LoginPage />;
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: "100vh",
                    backgroundColor: "background.default",
                }}
            >
                <Header onLogout={onLogout} setCurrentPage={setCurrentPage} />
                <Container component="main" sx={{ mt: 4, mb: 4 }}>
                    {renderPage()}
                </Container>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbar.severity}
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
