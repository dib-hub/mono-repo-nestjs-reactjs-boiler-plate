import { ExpensePaymentMethod } from '../../enums';

export interface IExpense {
  id: string;
  transactionId: string;
  carrierId: string;
  truckId: string;
  loadId: string;
  categoryId: string;
  expenseDate: Date;
  vendor: string;
  description: string;
  amount: number;
  paymentMethod: ExpensePaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}
