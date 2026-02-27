import React from 'react';

const Table = ({ columns, data, onRowClick, actions }) => {
    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th
                                            key={idx}
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {col.header}
                                        </th>
                                    ))}
                                    {actions && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={onRowClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}
                                    >
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {actions(row)}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No data found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
