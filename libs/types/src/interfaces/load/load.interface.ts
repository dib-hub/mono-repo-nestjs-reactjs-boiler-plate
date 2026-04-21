import { LoadStatus } from '../../enums';

export interface ILoad {
  id: string;
  carrierId: string;
  truckId?: string | null;
  status: LoadStatus;
  loadDate?: Date | null;
  brokerName: string;
  brokerRate: number;
  loadWeight?: number | null;
  currentZip: string;
  pickupZip: string;
  deliveryZip: string;
  pickupDate: Date;
  deliveryDate?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
