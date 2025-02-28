import React, { useEffect } from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, access, isAccessControlled }) => {
    const navigate = useNavigate();
    const { userRole, isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/auth/login");
        } else if (isAccessControlled && !access.includes(userRole)) {
            navigate("/unauthorized");
        }
    }, [isAuthenticated, access, isAccessControlled, userRole, navigate]);

    return <>

        {children}
    </>;

};

export default ProtectedRoute;

/*
        if (isAccessControlled && !access.includes(userRole)) {
            //  I SHOULD REDIRECT TO HOMEPAGE ACCORDING TO THAT ROLE
            //  OR SHOW UNAUTHORIZED PAGE WITH MESSAGE !
            //  but not return anything from here ! 
            return <p>not authorized </p>;
        }
*/