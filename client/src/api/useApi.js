import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../lib/AuthContext";

const backURL = "https://library-management-system-efs9.onrender.com";
// const backURL = "http://localhost:8000";

const useApi = () => {
    const { user, setUser, setSnackbar, setLoading } = useContext(AuthContext);

    const getHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        };
    };

    const apiRequest = async (endpoint, method = "GET", body = null) => {
        setLoading(true);
        try {
            const options = {
                method,
                headers: getHeaders(),
                body: body ? JSON.stringify(body) : null,
            };
            console.log(`${backURL}${endpoint}`);
            const response = await fetch(`${backURL}${endpoint}`, options);
            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors from express-validator
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors
                        .map((err) => err.msg)
                        .join(", ");
                    throw new Error(errorMessages);
                }
                throw new Error(
                    data.message || data.error || "API request failed."
                );
            }
            return data;
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || "Something went wrong.",
                severity: "error",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        get: (endpoint) => apiRequest(endpoint),
        post: (endpoint, body) => apiRequest(endpoint, "POST", body),
        patch: (endpoint, body) => apiRequest(endpoint, "PATCH", body),
    };
};

export default useApi;
