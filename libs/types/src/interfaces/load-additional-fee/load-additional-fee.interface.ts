export interface ILoadAdditionalFee {
  id: string;
  loadId: string;
  feeType: string;
  description?: string | null;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
