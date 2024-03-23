import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

//redirected to here from Auth0Provider.. redirection function
const AuthCallbackPage = () => {
    const { createUser } = useCreateMyUser();
    const { user } = useAuth0();
    const navigate = useNavigate();

    //using as a toggler(why not a variable?) only to Extra sure that useEffect run only once
    //UseRef stores state value but compnt never rerendered if its state value changed(unlike useState hook) 
    const hasCreatedUser = useRef(false);

    useEffect(() => {
        if (user?.sub && user?.email && !hasCreatedUser.current) {
            createUser({ auth0Id: user.sub, email: user.email });
            hasCreatedUser.current = true;
        }
        navigate("/");
    }, [createUser, navigate, user]);

    return (
        <>Loading...</>
    )
}

export default AuthCallbackPage