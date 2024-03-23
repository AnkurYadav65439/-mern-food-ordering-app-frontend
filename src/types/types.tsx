export type User = {
    _id: string;
    email: string;
    name: string;
    addressLine1: string;
    city: string;
    country: string;
}

export type CreateUserRequest = {
    auth0Id: string;
    email: string;
}

export type UpdateUserRequest = {
    name: string;
    addressLine1: string;
    city: string;
    country: string;
}