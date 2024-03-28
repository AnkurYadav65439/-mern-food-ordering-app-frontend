import { z } from "zod";
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import DetailsSection from "./DetailsSection";
import CuisinesSection from "./CuisinesSection";
import { Separator } from "@radix-ui/react-separator";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types/types";
import { useEffect } from "react";

const formSchema = z.object({
    restaurantName: z.string({
        required_error: "restaurant name is required"
    }),
    city: z.string({
        required_error: "city is required"
    }),
    country: z.string({
        required_error: "country is required"
    }),
    //coerce fun converts string into number as html elem always takes values in string
    deliveryPrice: z.coerce.number({
        required_error: "delivery price is required",
        invalid_type_error: "must be a valid number"
    }),
    estimatedDeliveryTime: z.coerce.number({
        required_error: "estimated delivery time is required",
        invalid_type_error: "must be a valid number"
    }),
    cuisines: z.array(z.string()).nonempty({
        message: "please select atleast one item"
    }),
    menuItems: z.array(z.object({
        name: z.string().min(1, "name is required"),
        price: z.coerce.number().min(1, "price is required"),
    })),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional()
})
    .refine((data) => data.imageUrl || data.imageFile, {
        message: "Either image URL or image File must be provided",
        path: ["imageFile"]
    });

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (restaurantFormData: FormData) => void;
    isLoading: boolean;
    restaurant?: Restaurant
}

function ManageRestaurantForm({ onSave, isLoading, restaurant }: Props) {
    // 1. Define your form.
    const form = useForm<RestaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cuisines: [],
            menuItems: [{ name: "", price: 0 }],
        }
    });

    //to prepopulate existing restaurant details
    useEffect(() => {
        if (!restaurant) {
            return;
        }
        //as we converted values into lowest denomination(pence) thats why formatting in here and not setting restaurant values in default Values
        // const deliveryPriceFormatted = parseInt((restaurant.deliveryPrice / 100).toFixed(2));
        const deliveryPriceFormatted = restaurant.deliveryPrice / 100;
        const menuItemsFormatted = restaurant.menuItems.map((item) => ({
            ...item,
            // price: parseInt((item.price / 100).toFixed(2))
            price: item.price / 100
        }))

        const updatedRestaurant = {
            ...restaurant,
            deliveryPrice: deliveryPriceFormatted,
            menuItems: menuItemsFormatted,
        }

        form.reset(updatedRestaurant);
    }, [form, restaurant]);

    const onSubmit = (formDataJson: RestaurantFormData) => {
        //converting json into multipart/FormData as we are sending data as FormData not Apllication/json(like usually)
        const formData = new FormData();
        formData.append("restaurantName", formDataJson.restaurantName);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("deliveryPrice", (formDataJson.deliveryPrice * 100).toString());
        //converting into lowest denomination of currency used(here pence) and toString() as http request only take values as string
        formData.append("estimatedDeliveryTime", formDataJson.estimatedDeliveryTime.toString());
        formDataJson.cuisines.forEach((cuisine, index) => (
            formData.append(`cuisines[${index}]`, cuisine)
        ));
        formDataJson.menuItems.forEach((menuItem, index) => {
            formData.append(`menuItems[${index}][name]`, menuItem.name);
            formData.append(`menuItems[${index}][price]`, (menuItem.price * 100).toString());
        });

        if (formDataJson.imageFile) {
            formData.append("imageFile", formDataJson.imageFile);
        }

        onSave(formData);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-50 p-10 rounded-lg">
                <DetailsSection />
                <Separator />
                <CuisinesSection />
                <Separator />
                <MenuSection />
                <Separator />
                <ImageSection />

                {isLoading ? <LoadingButton /> : <Button type="submit">{restaurant ? "Update" : "Submit"}</Button>}
            </form>
        </Form>
    )
}

export default ManageRestaurantForm

