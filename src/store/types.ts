// Shared API types mirroring the backend response contracts.

export type Role = 'admin' | 'host' | 'cleaner';

// Every backend response is wrapped by sendResponse().
export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  token?: string;
  data: T;
}

// Subset of the sanitized user the backend returns. Kept loose because the
// backend fills every profile field with null when unset.
export interface User {
  _id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  role: Role | null;
  phone: string | null;
  profileImage: string | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  [key: string]: unknown;
}

export interface Accommodation {
  _id: string;
  name: string;
  accommodationType: string;
  address: string;
  city: string;
  zipCode: string;
  floor?: string;
  doorCode?: string;
  numberOfRooms: number;
  surface: number;
  hasElevator: boolean;
  cleaningRate: number;
  notes?: string;
  photos: string[];
  keys?: string;
  accessCode?: string;
  instructions?: string;
  frequency?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'scheduled' | 'not_scheduled';
  host: string | { _id: string; firstName?: string; lastName?: string };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Host-view annotations added by the listing endpoints.
  isCleanerAssigned?: boolean;
  cleanerStage?: 'new' | 'assigned' | 'accepted';
  assignedCleaners?: AssignedCleaner[];
  paymentStatus?: string | null;
  scheduleStatus?: string | null;
}

export interface AssignedCleaner {
  assignmentId: string;
  cleaner: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    profileImage?: string | null;
  } | null;
  role: 'primary' | 'substitute';
  status: 'pending' | 'accepted' | 'refused';
  pricePerCleaning?: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

// A cleaner's public profile (returned by the housekeeper discovery endpoints).
export interface Housekeeper {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  profileImage?: string | null;
  interventionZone?: string;
  about?: string;
  biography?: string;
  languages?: string[];
  servicesOffered?: string[];
  cleaningsCompleted?: number;
  workCity?: string;
  serviceRadius?: number;
  availability?: 'full_time' | 'part_time' | 'flexible';
  [key: string]: unknown;
}

export interface CleanerAssignment {
  _id: string;
  accommodation: string | Partial<Accommodation>;
  host: string;
  cleaner: string | Housekeeper;
  role: 'primary' | 'substitute';
  status: 'pending' | 'accepted' | 'refused';
  pricePerCleaning?: number;
  message?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleStatus =
  | 'scheduled'
  | 'accepted'
  | 'refused'
  | 'in_progress'
  | 'proof_submitted'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface CleaningSchedule {
  _id: string;
  accommodation: string | Partial<Accommodation>;
  host: string | Partial<User>;
  cleaner: string | Housekeeper;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  notes?: string;
  status: ScheduleStatus;
  paymentStatus: 'unpaid' | 'paid_held' | 'released' | 'refunded';
  proofPhotos?: string[];
  proofNotes?: string;
  dispute?: { reason?: string; notes?: string; photos: string[]; raisedAt: string } | null;
  completedAt?: string;
  cleanerResponse?: 'pending' | 'accepted' | 'refused';
  latestPayment?: { status: string; amount: number; currency: string; createdAt: string } | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface CalendarConnection {
  _id: string;
  accommodation: string;
  host: string;
  platform: string;
  label?: string;
  icalUrl: string;
  lastSyncedAt?: string;
  lastSyncStatus?: 'success' | 'failed';
  lastSyncError?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
