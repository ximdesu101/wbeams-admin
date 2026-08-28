import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminMe } from "@/services/authService";

const AuthProtector = () => {
    const [invalid, setInvalid] = useState(false);
    const hasToken = !!localStorage.getItem("token");
    const validatingRef = useRef(false);

    const validateAuth = async () => {
        if (validatingRef.current) return; 
        validatingRef.current = true;

        const token = localStorage.getItem("token");
        if (!token) {
            setInvalid(true);
            validatingRef.current = false;
            return;
        }

        try {
            await AdminMe();
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            setInvalid(true);
        } finally {
            validatingRef.current = false;
        }
    };

    useEffect(() => {
        validateAuth();

        const handlePageShow = (event) => {
            if (event.persisted) {
                validateAuth();
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    if (!hasToken || invalid) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AuthProtector;