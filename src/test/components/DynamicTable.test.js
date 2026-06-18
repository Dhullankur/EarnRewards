import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DynamicTable from "../../components/DynamicTable";

describe("DynamicTable", () => {
  it("renders empty state when rows are empty", () => {
    render(<DynamicTable title="Empty Table" rows={[]} />);

    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("hides id column when configured", () => {
    render(
      <DynamicTable
        title="Rewards"
        rows={[
          { id: "MU-1", name: "John", rewardPoints: 30 },
          { id: "MU-2", name: "Jane", rewardPoints: 50 },
        ]}
        hiddenColumns={["id"]}
      />,
    );

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.queryByText("MU-1")).not.toBeInTheDocument();
    expect(screen.queryByText("Id")).not.toBeInTheDocument();
  });

  it("uses transactionId as the row key when id is absent", () => {
    const { container } = render(
      <DynamicTable
        title="Transactions"
        rows={[
          {
            transactionId: "T-2026-0001",
            name: "John",
            rewardPoints: 30,
          },
        ]}
      />,
    );

    expect(container.querySelector("tbody tr")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("renders headers from row keys", () => {
    render(
      <DynamicTable
        title="Rewards"
        rows={[{ id: "TR-1", name: "John", rewardPoints: 30 }]}
      />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });
});
