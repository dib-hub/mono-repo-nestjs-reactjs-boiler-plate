export interface ILoadEstimateFuelBreakdown {
  id: string;
  estimateId: string;
  stateCode: string;
  stateName?: string | null;
  distanceMiles: number;
  fuelPricePerGallon: number;
  fuelType?: string | null;
  eiaSeriesId?: string | null;
  priceDate: Date;
  fuelCost: number;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}
