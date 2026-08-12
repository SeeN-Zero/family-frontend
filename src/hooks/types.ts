// API entity types matching the backend (Java/Quarkus) REST responses.
// Field names follow the OpenAPI spec in the `openapi` file at the repo root.

export type CategoryType = "EXPENSE" | "INCOME";
export type LoanType = "DEBT" | "RECEIVABLE";
export type LoanStatus = "ACTIVE" | "PARTIALLY_PAID" | "PAID";
export type CurrencyCode = "IDR";

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export type ApiCategory = {
  categoryId: string;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  displayOrder: number;
  isSystem: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiAccount = {
  accountId: string;
  name: string;
  balance: number;
  currency: CurrencyCode;
  icon: string | null;
  color: string | null;
  displayOrder: number;
  archived: boolean;
};

export type ApiTransaction = {
  transactionId: string;
  accountId: string;
  accountName: string;
  accountIcon: string | null;
  accountColor: string | null;
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  amount: number;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiContact = {
  contactId: string;
  userId: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiLoan = {
  loanId: string;
  userId: string;
  contactId: string;
  contactName: string;
  accountId: string;
  accountName: string;
  loanType: LoanType;
  status: LoanStatus;
  amount: number;
  remainingAmount: number;
  description: string | null;
  transactionDate: string;
  dueDate: string | null;
  createTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiLoanPayment = {
  paymentId: string;
  loanId: string;
  accountId: string;
  accountName: string;
  amount: number;
  paymentDate: string;
  description: string | null;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiPage<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

export type CategoryFilter = {
  type?: CategoryType;
  includeArchived?: boolean;
};

export type AccountFilter = {
  includeArchived?: boolean;
};

export type TransactionFilter = {
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
};

export type LoanFilter = {
  accountId?: string;
  contactId?: string;
  loanType?: LoanType;
  status?: LoanStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

// ---------------------------------------------------------------------------
// Create / Update request types
// ---------------------------------------------------------------------------

export type CreateCategoryRequest = {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
};

export type UpdateCategoryRequest = {
  name: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isArchived?: boolean;
};

export type CreateAccountRequest = {
  name: string;
  currency: CurrencyCode;
  icon?: string;
  color?: string;
};

export type UpdateAccountRequest = {
  name: string;
  currency: CurrencyCode;
  icon?: string;
  color?: string;
  displayOrder?: number;
};

export type CreateTransactionRequest = {
  accountId: string;
  categoryId: string;
  amount: number;
  description?: string;
  transactionDate: string;
};

export type UpdateTransactionRequest = CreateTransactionRequest;

export type CreateContactRequest = {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
};

export type UpdateContactRequest = CreateContactRequest;

export type CreateLoanRequest = {
  contactId: string;
  accountId: string;
  loanType: LoanType;
  amount: number;
  description?: string;
  transactionDate: string;
  dueDate?: string;
};

export type CreateLoanPaymentRequest = {
  accountId: string;
  amount: number;
  paymentDate: string;
  description?: string;
};

export type UpdateLoanPaymentRequest = CreateLoanPaymentRequest;

export type CreateTransferRequest = {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  transactionDate: string;
};
