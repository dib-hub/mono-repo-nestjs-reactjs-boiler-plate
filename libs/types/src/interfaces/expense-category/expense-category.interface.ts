export interface IExpenseCategory {
  id: string;
  categoryName: string;
  quickbooksAccountName: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
