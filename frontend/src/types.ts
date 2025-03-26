export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    imageUrl?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    avatarUrl?: string;
    fullName?: string;
    phone?: string;
    birthDate?: string;
}

export interface Review {
    id: number;
    product: Product;
    user: User;
    rating: number;
    comment: string;
    parentReview?: Review;
    replies?: Review[];
    isHidden?: boolean;
}

export interface ReviewDTO {
    id: number;
    rating: number;
    comment: string;
    user: {
        id: number;
        fullName: string;
        avatarUrl?: string;
    };
    likesCount: number;
    dislikesCount: number;
    likedByCurrentUser: boolean;
    dislikedByCurrentUser: boolean;
    parentReviewId?: number;
    replies: ReviewDTO[];
    isHidden: boolean;
    isAdminResponse: boolean;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

export interface Order {
    id: number;
    totalPrice: number;
    status: string;
    deliveryMethod: string;
    paymentMethod: string;
    qrCodeUrl: string;
    paymentStatus: string;
    createdAt: string;
    paymentDeadline: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
}