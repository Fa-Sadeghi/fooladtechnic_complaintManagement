
import type { ReactNode } from "react";
import fa from "../../locales/fa";

export interface TableColumn<T> {
    key: keyof T | string;
    title: string;
    width?: string;
    align?: "right" | "center" | "left";
    render?: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    rowKey: keyof T;
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
                                         columns,
                                         data,
                                         rowKey,
                                         loading = false,
                                         emptyMessage = fa.common.noData,
                                         onRowClick,
                                     }: DataTableProps<T>) {
    return (
        <div className="data-table-wrapper">
            <div className="data-table-scroll">
                <table className="data-table">
                    <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                style={{
                                    width: column.width,
                                    textAlign: column.align ?? "right",
                                }}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="table-message">
                                <span className="table-loader" />
                                <span>{fa.common.loading}</span>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="table-message">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={String(row[rowKey])}
                                className={onRowClick ? "table-row-clickable" : ""}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((column) => {
                                    const value = row[column.key as keyof T];

                                    return (
                                        <td
                                            key={String(column.key)}
                                            style={{
                                                textAlign: column.align ?? "right",
                                            }}
                                        >
                                            {column.render
                                                ? column.render(row, index)
                                                : (value as ReactNode) ?? "—"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
