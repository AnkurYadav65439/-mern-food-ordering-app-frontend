import { Order } from "@/types/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type CheckoutSessionRequest = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
        //later convert into no. and no price sent due to security mainly, we fetch upto date price at backend
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };
    restaurantId: string;
}

export const UseGetMyOrders = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/order`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to get orders");
        }
        return response.json();
    };

    const { data: orders, isLoading } = useQuery("fetchMyOrders", getMyOrdersRequest, { refetchInterval: 5000 });

    return { orders, isLoading };
}

export const UseCreateCheckoutSession = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createAccountSessionRequest = async (checkoutSessionRequest: CheckoutSessionRequest) => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/order/checkout/create-checkout-session`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(checkoutSessionRequest)
        });

        if (!response.ok) {
            throw new Error("Unable to create checkout session");
        }
        return response.json();
    }
    const {
        mutateAsync: createCheckoutSession,
        isLoading,
        error,
        reset
    } = useMutation(createAccountSessionRequest);

    if (error) {
        toast.error(error.toString());
        reset();
    }

    return {
        createCheckoutSession,
        isLoading
    }
}