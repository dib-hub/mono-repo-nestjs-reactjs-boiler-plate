import { DocumentType } from '../../enums';

export interface IDocument {
  id: string;
  carrierId: string;
  truckId: string;
  loadId: string;
  expenseId: string;
  documentType: DocumentType;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}
