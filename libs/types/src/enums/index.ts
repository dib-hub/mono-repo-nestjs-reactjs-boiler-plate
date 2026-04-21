export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum LoadStatus {
  BOOKED = 'BOOKED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum ExpensePaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH',
  CHECK = 'CHECK',
  TRANSFER = 'TRANSFER',
}

export enum DocumentType {
  RATE_CONFIRMATION = 'RATE_CONFIRMATION',
  BOL = 'BOL',
  POD = 'POD',
  SETTLEMENT = 'SETTLEMENT',
  RECEIPT = 'RECEIPT',
  INVOICE = 'INVOICE',
  INSURANCE = 'INSURANCE',
  PERMIT = 'PERMIT',
  REGISTRATION = 'REGISTRATION',
  IFTA = 'IFTA',
  TAX = 'TAX',
  PHOTO = 'PHOTO',
  OTHER = 'OTHER',
}
