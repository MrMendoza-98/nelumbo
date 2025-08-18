export interface VehicleRegistrationResult {
  success: boolean;
  message: string;
  plate: string;
  parkingId: number;
  emailSent?: boolean;
  emailMessage?: string;
  timestamp: Date;
}

export interface VehicleExitResult {
  success: boolean;
  message: string;
  plate: string;
  parkingId: number;
  exitTime: Date;
  totalPrice: number;
}

export interface ParkedVehicle {
  plate: string;
  entryTime: Date;
  parkingId: number;
}

export interface EmailNotificationData {
  email: string;
  plate: string;
  parkingId: number;
  ownerName?: string;
}
