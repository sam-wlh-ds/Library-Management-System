import { createTheme } from "@mui/material/styles";

const zincColors = {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
};

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: zincColors[700],
            light: zincColors[500],
            dark: zincColors[800],
            contrastText: "#ffffff",
        },
        secondary: {
            main: zincColors[600],
            light: zincColors[400],
            dark: zincColors[700],
            contrastText: "#ffffff",
        },
        background: {
            default: zincColors[50],
            paper: "#ffffff",
        },
        text: {
            primary: zincColors[900],
            secondary: zincColors[600],
        },
        divider: zincColors[200],
        grey: zincColors,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: zincColors[800],
                    color: "#ffffff",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                },
                contained: {
                    backgroundColor: zincColors[700],
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: zincColors[800],
                    },
                },
                outlined: {
                    borderColor: zincColors[300],
                    color: zincColors[700],
                    "&:hover": {
                        borderColor: zincColors[500],
                        backgroundColor: zincColors[50],
                    },
                },
                text: {
                    color: zincColors[600],
                    "&:hover": {
                        backgroundColor: zincColors[100],
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#ffffff",
                    border: `1px solid ${zincColors[200]}`,
                    boxShadow: `0 1px 3px 0 ${zincColors[200]}40, 0 1px 2px 0 ${zincColors[200]}60`,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: zincColors[300],
                        },
                        "&:hover fieldset": {
                            borderColor: zincColors[400],
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: zincColors[600],
                        },
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    backgroundColor: zincColors[50],
                },
            },
        },
    },
});

export default theme;
