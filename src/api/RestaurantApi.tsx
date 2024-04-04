import { searchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types/types";
import { useQuery } from "react-query"
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useGetRestaurant = (restaurantId?: string) => {
    const getRestaurantRequest = async (): Promise<Restaurant> => {
        const response = await fetch(`${API_BASE_URL}/api/restaurant/${restaurantId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch restaurant");
        }

        return response.json();
    }

    const { data: restaurant, isLoading, error } = useQuery("fetchRestaurant", getRestaurantRequest, { enabled: !!restaurantId });

    if (error) {
        toast.error(error.toString());
    }

    return {
        restaurant,
        isLoading
    }
}

export const useSearchRestaurants = (searchState: searchState, city?: string) => {

    const searchRestaurantsRequest = async (): Promise<RestaurantSearchResponse> => {
        //for making query of searchState
        const params = new URLSearchParams();
        params.set("searchQuery", searchState.searchQuery);
        params.set("page", searchState.page.toString());
        params.set("selectedCuisines", searchState.selectedCuisines.join(","));
        params.set("sortOption", searchState.sortOption);

        const response = await fetch(`${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`);

        if (!response.ok) {
            throw new Error("Failed to get restaurant");
        }
        return response.json();
    }
    //tells query to fetch again whenever 'searchState' changes. or else would show chached data
    const { data: results, isLoading } = useQuery(["searchRestaurants", searchState], searchRestaurantsRequest, { enabled: !!city });

    return {
        results,
        isLoading
    }
}