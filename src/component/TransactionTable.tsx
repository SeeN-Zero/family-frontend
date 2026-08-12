type Transaction = {
  date: string;
  description: string;
  category: string;
  amount: string;
  isPositive: boolean;
};

const TRANSACTIONS: Transaction[] = [
  {
    date: "12 OCT",
    description: "SYS_GROCERY_RUN",
    category: "[FOOD]",
    amount: "-Rp 128.500",
    isPositive: false,
  },
  {
    date: "10 OCT",
    description: "NET_SUBSCRIPTION",
    category: "[COMMS]",
    amount: "-Rp 64.000",
    isPositive: false,
  },
  {
    date: "05 OCT",
    description: "WAGE_DEPOSIT_INIT",
    category: "[INCOME]",
    amount: "+Rp 4.096.000",
    isPositive: true,
  },
  {
    date: "01 OCT",
    description: "POWER_GRID_FEE",
    category: "[UTIL]",
    amount: "-Rp 256.000",
    isPositive: false,
  },
];

export default function TransactionTable() {
  return (
    <section className="border border-primary p-6 h-full bg-background">
      <div className="font-label-caps text-label-caps text-primary mb-6 flex items-center justify-between">
        <span>RECENT TRANSACTIONS</span>
        <span className="animate-pulse">█</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-sm text-body-sm border-collapse">
          <thead>
            <tr className="text-on-surface-variant border-b border-outline-variant border-dashed">
              <th className="py-2 px-4 font-normal">DATE</th>
              <th className="py-2 px-4 font-normal">DESCRIPTION</th>
              <th className="py-2 px-4 font-normal">CATEGORY</th>
              <th className="py-2 px-4 font-normal text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.slice(0, 5).map((tx) => (
              <tr
                key={tx.description + tx.date}
                className="hover:bg-surface-variant transition-colors border-b border-outline-variant/30"
              >
                <td className="py-3 px-4 uppercase">{tx.date}</td>
                <td className="py-3 px-4">{tx.description}</td>
                <td className="py-3 px-4">{tx.category}</td>
                <td
                  className={`py-3 px-4 text-right ${
                    tx.isPositive ? "text-income" : "text-expense"
                  }`}
                >
                  {tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
