// Common Types and Interfaces

export enum UserRole {
    ADMIN = 'ADMIN',
    AUTHOR = 'AUTHOR',
    READER = 'READER',
    MODERATOR = 'MODERATOR'
}

export enum BookStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
    UNDER_REVIEW = 'UNDER_REVIEW'
}

export enum AgeGroup {
    TODDLER = 'TODDLER',        // 0-3 years
    PRESCHOOL = 'PRESCHOOL',    // 3-5 years
    EARLY_READER = 'EARLY_READER', // 5-7 years
    MIDDLE_GRADE = 'MIDDLE_GRADE', // 8-12 years
    YOUNG_ADULT = 'YOUNG_ADULT'    // 13+ years
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

export enum NotificationType {
    EMAIL = 'EMAIL',
    IN_APP = 'IN_APP',
    PUSH = 'PUSH'
}

export enum ContentModerationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    FLAGGED = 'FLAGGED'
}

// User Types
export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthTokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}

// Book Types
export interface Book {
    id: string;
    title: string;
    description: string;
    authorId: string;
    coverImageUrl?: string;
    ageGroup: AgeGroup;
    status: BookStatus;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

export interface Chapter {
    id: string;
    bookId: string;
    title: string;
    content: string;
    order: number;
    illustrationUrls: string[];
    createdAt: Date;
    updatedAt: Date;
}

// AI Types
export interface AIGenerationRequest {
    prompt: string;
    ageGroup: AgeGroup;
    maxLength?: number;
    style?: string;
}

export interface AIGenerationResponse {
    content: string;
    suggestions?: string[];
}

export interface GrammarCheckRequest {
    text: string;
}

export interface GrammarCheckResponse {
    corrections: Array<{
        original: string;
        suggestion: string;
        position: number;
        reason: string;
    }>;
}

export interface ContentSafetyCheckRequest {
    text: string;
    ageGroup: AgeGroup;
}

export interface ContentSafetyCheckResponse {
    isSafe: boolean;
    issues: Array<{
        type: string;
        severity: 'LOW' | 'MEDIUM' | 'HIGH';
        description: string;
    }>;
    moderationStatus: ContentModerationStatus;
}

// Payment Types
export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    stripePaymentId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

// Pagination
export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
