import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

export default function ChoreRoute() {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
