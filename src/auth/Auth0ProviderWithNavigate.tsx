import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props = {
    children: React.ReactNode
}

const Auth0ProviderWithNavigate = ({ children }: Props) => {
    const navigate = useNavigate();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;

    //Added after middleware jwtcheck. Act as identifier for backend api for auth token to right audience only
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;


    if (!domain || !clientId || !redirectUri || !audience) {
        throw new Error("unable to initialise auth");
    }

    //user redirected here by provider
    const onRedirectCallback = () => {
        //we also get here (appstate?: AppState, user?: User) as respnse
        //instead of creating user here, navigating to AuthCallbackPage(before access-token topic as access-token get from useAuth hook and 
        //useAuth hook only used within authProvider and here we are outside it)
        navigate("/auth-callback")
    }

    return (
        <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: redirectUri, audience }} onRedirectCallback={onRedirectCallback}>
            {children}
        </Auth0Provider>
    )
}

export default Auth0ProviderWithNavigate