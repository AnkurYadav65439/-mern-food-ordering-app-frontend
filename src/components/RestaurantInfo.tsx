import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Restaurant } from "@/types/types";
import { Dot } from "lucide-react";

type Props = {
    restaurant: Restaurant;
}

const RestaurantInfo = ({ restaurant }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">
                    {restaurant.restaurantName}
                </CardTitle>
                <CardDescription>
                    {restaurant.country}, {restaurant.city}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex">
                {restaurant.cuisines.map((cuisine, index) => (
                    <span className="flex">
                        <span>{cuisine}</span>
                        {index < restaurant.cuisines.length - 1 && <Dot />}
                    </span>
                ))}
            </CardContent>
        </Card>
    )
}

export default RestaurantInfo