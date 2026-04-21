export interface ICsvExport {
  id: string;
  carrierId: string;
  exportType: string;
  exportPeriodStart: Date;
  exportPeriodEnd: Date;
  fileName: string;
  recordCount: number;
  createdAt: Date;
  updatedAt: Date;
}
