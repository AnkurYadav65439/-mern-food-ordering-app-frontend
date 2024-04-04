import { CartItem } from "@/pages/DetailPage"
import { Restaurant } from "@/types/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Trash } from "lucide-react";

type Props = {
    restaurant: Restaurant;
    cartItems: CartItem[];
    removeFromCart: (cartItem: CartItem) => void;
}

const OrderSummary = ({ restaurant, cartItems, removeFromCart }: Props) => {

    const getTotalCost = () => {
        console.log("ordersummary ", cartItems)
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const totalWithDelivery = total + restaurant.deliveryPrice;
        return (totalWithDelivery / 100).toFixed(2);
    }

    return (
        <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
                <span>Your Order</span>
                <span>£{getTotalCost()}</span>
            </CardTitle>
            <CardContent className=" pb-0 flex flex-col gap-5">
                {cartItems.map((item) => (
                    <div className="flex justify-between">
                        <span>
                            <Badge variant="outline" className="mr-2">{item.quantity}</Badge>
                            {item.name}
                        </span>
                        <span className="flex items-center gap-1 ">
                            <Trash className="text-red-500 cursor-pointer hover:text-red-400" size={20} onClick={() => removeFromCart(item)}></Trash>
                            £{((item.quantity * item.price) / 100).toFixed(2)}
                        </span>
                    </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>£{(restaurant.deliveryPrice / 100).toFixed(2)}</span>
                </div>
                <Separator />
            </CardContent>
        </CardHeader>
    )
}

export default OrderSummary