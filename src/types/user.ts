export interface Account {
    email: string;
    password: string;
    passwordModified: Date;
}

export interface User {
    full_name: string;
    avatar?: string;
    phone_number?: string;
}
