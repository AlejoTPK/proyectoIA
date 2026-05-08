import React from "react";
import { cn } from "../../lib/utils";

interface DataTableProps {
  columns: string[];
  data: Record<string, unknown>[];
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 font-body">
        <p className="text-[17px]">La consulta no retornó resultados.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border-t border-hairline">
      <table className="w-full border-collapse font-body text-[14px]">
        <thead>
          <tr className="bg-parchment">
            {columns.map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-left font-semibold tracking-[-0.224px] text-gray-500 border-b border-hairline whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={cn(
                "transition-colors duration-150 border-b border-hairline",
                rowIdx % 2 === 0 ? "bg-white" : "bg-[#fafafc]",
                "hover:bg-[#f5f5f7]"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-6 py-3 text-ink max-w-[320px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={String(row[col] ?? "")}
                >
                  {row[col] != null ? String(row[col]) : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
