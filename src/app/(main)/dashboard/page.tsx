"use client";

import SummaryCard from "@/component/SummaryCard";
import TransactionTable from "@/component/TransactionTable";
import UserRoster from "@/component/UserRoster";
import {
  useAccountSummary,
  useFamilyBalanceSummary,
  useLoanSummary,
  useFamilyMembersForDashboard,
  useRecentTransactions,
} from "@/hooks/useDashboard";
import { useCategories } from "@/hooks/useCategories";

export default function DashboardPage() {
  const accountSummary = useAccountSummary();
  const familyBalanceSummary = useFamilyBalanceSummary();
  const loanSummary = useLoanSummary();
  const familyMembers = useFamilyMembersForDashboard();
  const recentTransactions = useRecentTransactions();
  const { data: categories = [] } = useCategories(undefined, undefined, true);

  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard
            label="TOTAL ACCOUNT"
            amount={accountSummary.data?.totalBalance ?? null}
            isLoading={accountSummary.isLoading}
          />
          <SummaryCard
            label="TOTAL FAMILY ACCOUNT"
            amount={familyBalanceSummary.data?.totalBalance ?? null}
            isLoading={familyBalanceSummary.isLoading}
            variant="highlight"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 h-full">
            <TransactionTable
              transactions={recentTransactions.data?.items ?? []}
              categories={categories}
            />
          </div>
          <div className="h-full">
            <UserRoster
              members={familyMembers.data ?? []}
              isLoading={familyMembers.isLoading}
            />
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard
            label="TOTAL LOAN"
            amount={loanSummary.data?.totalDebtRemaining ?? null}
            isLoading={loanSummary.isLoading}
            variant="highlight"
          />
          <SummaryCard
            label="TOTAL RECEIVABLE"
            amount={loanSummary.data?.totalReceivableRemaining ?? null}
            isLoading={loanSummary.isLoading}
          />
        </section>
      </div>
    </>
  );
}

