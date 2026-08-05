interface iAddresses {
    _id?: string;
    label: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault?: boolean;
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;          // optional
    googleId?: string;
    authProvider?: "local" | "google";
    role?: string;
    addresses?: iAddresses[];
    createdAt?: Date;
    updatedAt?: Date;
  }