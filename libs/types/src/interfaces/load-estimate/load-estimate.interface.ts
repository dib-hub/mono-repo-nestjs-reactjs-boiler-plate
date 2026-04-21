export interface ILoadEstimate {
  id: string;
  loadId: string;
  deadheadMiles: number;
  loadedMiles: number;
  totalMiles: number;
  regionalFuelPrice: number;
  deadheadFuelCost: number;
  loadedFuelCost: number;
  fuelCost: number;
  durationSeconds: number;
  tolls: number;
  factoringCost: number;
  operatingCost: number;
  additionalFeesTotal: number;
  totalCost: number;
  profit: number;
  cpmUsed: number;
  loadedMpgUsed: number;
  unloadedMpgUsed: number;
  routeData?: unknown | null;
  routeNotices?: unknown | null;
  createdAt: Date;
  updatedAt: Date;
}
