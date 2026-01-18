// ============================================
// COMMON/HELPER TYPES
// ============================================

// Response type untuk list dengan pagination
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// Generic API Response
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Error type
export interface ApiError {
    code: string;
    message: string;
}
