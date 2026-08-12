import SummaryCard from "@/component/SummaryCard";
import TransactionTable from "@/component/TransactionTable";
import UserRoster from "@/component/UserRoster";

export default function DashboardPage() {
  return (
    <>
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard label="TOTAL ACCOUNT" amount="Rp 4.096.000" />
          <SummaryCard
            label="TOTAL FAMILY ACCOUNT"
            amount="Rp 8.192.000"
            variant="highlight"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 h-full">
            <TransactionTable />
          </div>
          <div className="h-full">
            <UserRoster />
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard
            label="TOTAL LOAN"
            amount="Rp 4.096.000"
            variant="highlight"
          />
          <SummaryCard label="TOTAL RECEIVABLE" amount="Rp 8.192.000" />
        </section>
      </div>
    </>
  );
}
