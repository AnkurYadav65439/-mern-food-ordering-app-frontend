import { CreateUserRequest, UpdateUserRequest, User } from "@/types/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyCurrentUser = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return response.json();
    }

    const { data: currentUser, isLoading, error } = useQuery("fetchCurrentUser", getMyCurrentUser);

    if (error) {
        toast.error(error.toString());
    }

    return {
        currentUser,
        isLoading
    }
}

export const useCreateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    //below is mutationFn used in useMutation
    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }
    };

    //can also directly return useMuation(snapg) and destrcuture its provided properties there
    const {
        mutateAsync: createUser,
        isLoading,
        isError,
        isSuccess
    } = useMutation(createMyUserRequest);

    return {
        createUser,
        isLoading,
        isError,
        isSuccess
    };
}

export const useUpdateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    //below is mutationFn used in useMutation
    const updateMyUserRequest = async (formData: UpdateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "PUT",
            headers: {
                authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
        }
    };

    //can also directly return useMuation(snapg) and destrcuture its provided properties there
    const {
        mutateAsync: updateUser,
        isLoading,
        isSuccess,
        error,
        reset
    } = useMutation(updateMyUserRequest);

    if (isSuccess) {
        toast.success("User profile updated!");
    }

    if (error) {
        toast.error(error.toString());
        reset();
    }

    return {
        updateUser,
        isLoading
    };
}

