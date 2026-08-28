import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLogout } from "@/services/authService";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const token = localStorage.getItem("token");

            try {
                if (token) {
                    await AdminLogout(token);
                }
            } catch (error) {
                console.error(error);
            } finally {
                localStorage.removeItem("token");
                localStorage.removeItem("admin");

                navigate("/", { replace: true });
            }
        };

        handleLogout();
    }, [navigate]);

    return null;
};

export default Logout;