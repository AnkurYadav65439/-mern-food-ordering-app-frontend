import { UseCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurant } from "@/api/RestaurantApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { MenuItem as menuItem } from "@/types/types";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useState } from "react";
import { useParams } from "react-router-dom"

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

const DetailPage = () => {
    const { createCheckoutSession, isLoading: isCheckoutLoading } = UseCreateCheckoutSession();
    const { restaurantId } = useParams();
    const { restaurant, isLoading } = useGetRestaurant(restaurantId);
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    const addToCart = (menuItem: menuItem) => {
        //or first check by .find then conditions(no need of flag)
        setCartItems((prevState) => {
            let itemAdded = false;
            let newCartItems;
            newCartItems = prevState.map((cartItem) => {
                if (cartItem._id === menuItem._id) {
                    itemAdded = true;
                    return { ...cartItem, quantity: cartItem.quantity + 1 }
                } else {
                    return cartItem;
                }
            });

            if (!itemAdded) {
                newCartItems = [
                    ...cartItems,
                    {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1
                    }
                ];
            }

            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(newCartItems));

            return newCartItems;

        })

    }

    const removeFromCart = (item: CartItem) => {
        setCartItems((prevState) => {
            let itemReduced = false;
            let newCartItems;
            newCartItems = prevState.map((cartItem) => {
                if (cartItem._id === item._id && cartItem.quantity > 1) {
                    itemReduced = true;
                    return { ...cartItem, quantity: cartItem.quantity - 1 }
                } else {
                    return cartItem;
                }
            });

            if (!itemReduced) {
                newCartItems = prevState.filter((cartItem: CartItem) => cartItem._id !== item._id);
            }

            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(newCartItems));

            return newCartItems;

        })
    }

    const onCheckout = async (userFormData: UserFormData) => {
        if (!restaurant) {
            return;
        }

        const checkoutData = {
            cartItems: cartItems.map((cartItem) => (
                {
                    menuItemId: cartItem._id,
                    name: cartItem.name,
                    quantity: cartItem.quantity.toString(),
                }
            )),
            restaurantId: restaurant._id,
            deliveryDetails: {
                email: userFormData.email as string,
                name: userFormData.name,
                addressLine1: userFormData.addressLine1,
                city: userFormData.city
            }
        };
        const data = await createCheckoutSession(checkoutData);
        //stripe hosted url
        window.location.href = data.url;
    }

    if (isLoading || !restaurant) {
        return "...Loading";
    }

    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16 / 5}>
                <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full" />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant} />
                    <span className="text-2xl font-bold tracking-tight">Menu</span>
                    {restaurant.menuItems.map((item) => (
                        <MenuItem menuItem={item} addToCart={() => addToCart(item)} />
                    ))}
                </div>
                <div>
                    <Card>
                        <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart} />
                        <CardFooter>
                            <CheckoutButton onCheckout={onCheckout} disabled={cartItems.length === 0} isLoading={isCheckoutLoading} />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DetailPage