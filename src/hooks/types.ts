export type {
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/features/accounts/schemas";
export type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/features/categories/schemas";
export type {
  CreateContactRequest,
  UpdateContactRequest,
} from "@/features/contacts/schemas";
export type {
  CreateLoanPaymentRequest,
  CreateLoanRequest,
  UpdateLoanPaymentRequest,
} from "@/features/loans/schemas";
export type {
  CreateTransactionRequest,
  CreateTransferRequest,
  UpdateTransactionRequest,
} from "@/features/transactions/schemas";
export type {
  CreateFamilyRequest,
  JoinFamilyRequest,
  Title as TitleInput,
  Role as RoleInput,
} from "@/features/family/schemas";

export type Title = "FATHER" | "MOTHER" | "CHILD";
export type Role = "OWNER" | "MEMBER";


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

export type ApiFamily = {
  familyId: string;
  name: string;
  inviteCode: string;
  role: Role;
  title: Title;
};

export type ApiFamilyMember = {
  memberId: string;
  name: string;
  email: string;
  role: Role;
  title: Title;
};

export type ApiAccountSummary = {
  totalBalance: number;
};

export type ApiFamilyBalanceSummary = {
  totalBalance: number;
};

export type ApiLoanSummary = {
  totalDebtRemaining: number;
  totalReceivableRemaining: number;
};

export type ApiUserAccount = {
  userId: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserAccountRequest = {
  name: string;
};

export type ApiCycle = {
  cycleStartDay: number;
};

export type UpdateCycleRequest = {
  cycleStartDay: number;
};

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export type ApiCategoryBreakdown = {
  categoryId: string;
  categoryName: string;
  icon: string | null;
  color: string | null;
  totalAmount: number;
  transactionCount: number;
};

export type ApiReportSummary = {
  totalIncome: number;
  totalExpense: number;
  net: number;
};

export type ApiTrendPoint = {
  label: string;
  totalIncome: number;
  totalExpense: number;
};

export type ReportPeriod = {
  label: string;
  dateFrom: string;
  dateTo: string;
};

export type ReportFilter = {
  accountId?: string;
  dateFrom: string;
  dateTo: string;
};

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

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

