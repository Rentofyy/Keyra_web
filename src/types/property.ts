export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface PropertyPhoto {
  id?: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface PropertyVideo {
  id?: string;
  url: string;
  durationSeconds?: number;
}

export interface PropertySummary {
  id: string;
  title: string;
  societyName?: string | null;
  address: string;
  locality?: string | null;
  city?: string | null;
  // Support both backend API name (rentAmount) and frontend alias (monthlyRent)
  rentAmount: number;
  monthlyRent?: number;
  // Support both backend API name (depositAmount) and frontend alias (securityDeposit)
  depositAmount: number;
  securityDeposit?: number;
  maintenanceCharges?: number | null;
  maintenanceIncluded?: boolean | null;
  // Support both backend API name (bhkType) and frontend alias (bhk)
  bhkType?: string | null;
  bhk?: string | null;
  furnishingStatus?: string | null;
  carpetAreaSqft?: number | null;
  carpetAreaSqFt?: number | null;
  superBuiltUpAreaSqFt?: number | null;
  propertyCategory?: string | null;
  category?: string | null;
  status?: string | null;
  verificationStatus?: string | null;
  primaryPhotoUrl?: string | null;
  photos?: (string | PropertyPhoto)[] | null;
  videos?: (string | PropertyVideo)[] | null;
  isVerified?: boolean | null;
  isFavourite?: boolean | null;
  location?: LocationCoordinates | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string | null;
  societyAmenities?: string[] | string | null;
  isFeatured?: boolean | null;
  visitCount?: number | null;
}

export interface PropertyDetail extends PropertySummary {
  description?: string | null;
  cleanDescription?: string | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  facing?: string | null;
  balconiesCount?: number | null;
  bathroomsCount?: number | null;
  tenantPreference?: string | null;
  foodPreference?: string | null;
  petsAllowed?: boolean | null;
  availableFrom?: string | null;
  amenities?: string[] | null;
  keyHighlights?: string[] | null;
  hasInverter?: boolean | null;
  ownerId?: string | null;
  ownerName?: string | null;
}

export interface PropertyFinalizationData {
  paymentId?: string | null;
  dealId?: string | null;
  propertyId: string;
  tenantId?: string | null;
  orderId?: string | null;
  amount: number;
  currency: string;
  status: "NOT_PURCHASED" | "COMPLETED" | string;
  passTitle: string;
  deliverables: string[];
  guaranteePolicy: string;
  legalAgreementDisclaimer: string;
  createdAt?: string;
}

export interface FinalizationCheckoutData {
  orderId: string;
  amountInPaise: number;
  amountInRupees: number;
  currency: string;
  keyId: string;
  planCode: string;
  planName: string;
  originalFee: number;
  walletDiscount: number;
  gatewayPayable: number;
  remainingWalletBalance: number;
  propertyId: string;
  propertyTitle: string;
  isWalletOnly: boolean;
}

export interface FinalizationInitiatePayload {
  useWallet?: boolean;
  walletOnly?: boolean;
}

export interface FinalizationVerifyPayload {
  orderId: string;
  paymentId?: string | null;
  signature?: string | null;
  walletOnly?: boolean;
}

export interface PropertyFilterParams {
  query?: string;
  locality?: string;
  city?: string;
  minRent?: number;
  maxRent?: number;
  bhk?: string;
  furnishingStatus?: string;
  tenantPreference?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}
