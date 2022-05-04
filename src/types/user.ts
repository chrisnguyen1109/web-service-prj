export interface Account {
    email: string;
    password: string;
    passwordModified: Date;
}

export interface User {
    fullName: string;
    avatar?: string;
    phoneNumber?: string;
}
