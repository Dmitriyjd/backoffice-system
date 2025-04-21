export interface User {
    _id: string;
    name: string;
    email: string;
    role: {
        name: string;
        permissions: string[];
    };
}
