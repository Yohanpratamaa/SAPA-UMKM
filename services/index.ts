export { AppFlowService } from "./AppFlowService";
// Use API-connected AuthService instead of local storage version
export { AuthService } from "./AuthServiceAPI";
// Export API-based services aliased as StorageService for backward compatibility
export { ProductService as ProductStorageService } from "./ProductServiceAPI";
export { ProfileService as ProfileStorageService } from "./ProfileServiceAPI";
export { TrainingService as TrainingStorageService } from "./TrainingServiceAPI";
// Image upload service with fallback support
export { ImageUploadService } from "./ImageUploadService";

// API Client for Backend Connection
export { API_CONFIG, apiClient } from "./api";
