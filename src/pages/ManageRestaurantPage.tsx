import { useCreateMyRestaurant, useGetMyRestaurant, useGetMyRestaurantOrders, useUpdateMyRestaurant } from "@/api/MyRestaurantApi"
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrderItemCard from "@/components/OrderItemCard";


function ManageRestaurantPage() {
    const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
    const { restaurant } = useGetMyRestaurant();
    const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();
    const { orders } = useGetMyRestaurantOrders();
    console.log("Render MnageResPage", orders);

    const isEditing = !!restaurant;

    return (
        <Tabs defaultValue="orders">
            <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-5 bg-gray-50 pb-10 rounded-lg">
                <h2 className="text-2xl font-bold">{orders?.length} active orders</h2>
                {orders?.map((order) => (
                    <OrderItemCard order={order} />
                ))}
            </TabsContent>
            <TabsContent value="manage-restaurant">
                <ManageRestaurantForm onSave={isEditing ? updateRestaurant : createRestaurant} isLoading={isCreateLoading || isUpdateLoading} restaurant={restaurant} />
            </TabsContent>
        </Tabs>
    )
}

export default ManageRestaurantPage