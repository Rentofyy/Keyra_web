export interface UserProfile {
  id: string;
  phoneNumber: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  roles?: string[];
  verified?: boolean;
  isKycVerified?: boolean;
  createdAt?: string;
}

export interface BackendUserDto {
  id: string;
  phoneNumber: string;
  role?: string;
  roles?: string[];
  verified?: boolean;
  fullName?: string;
  email?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  user?: BackendUserDto;
  // Fallbacks for backwards compatibility
  token?: string;
  userId?: string;
  phoneNumber?: string;
  roles?: string[];
  isNewUser?: boolean;
}

export interface SessionData {
  user: UserProfile | null;
  isAuthenticated: boolean;
}
