export interface TopVehiclesResponse {
  vehicles: Array<{ plate: string; count: number }>;

  total: number;
  summary: {
    totalRegistrations: number;
    averageRegistrations: number;
    mostFrequentVehicle: string;
    mostFrequentCount: number;
  };
  timestamp: Date;
}



