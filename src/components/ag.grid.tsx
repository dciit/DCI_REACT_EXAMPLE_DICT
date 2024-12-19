// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
let times = 1;
const GridExample: React.FC = () => {
    const [rowData] = useState([
        { id: 1, name: 'John Doe', age: 25 },
        { id: 2, name: 'Jane Smith', age: 30 },
        { id: 3, name: 'Sam Brown', age: 22 },
    ]);

    const [columnDefs] = useState([
        { field: 'id', headerName: 'ID', sortable: true, filter: true },
        { field: 'name', headerName: 'Name', sortable: true, filter: true },
        { field: 'age', headerName: 'Age', sortable: true, filter: true },
    ]);
    const defaultColDef = useMemo(() => {
        return {
            valueFormatter: (params: any) => {
                times++;
                return params.value;
            },
            cellClass: "custom-border",
            filter: "agTextColumnFilter",
            cellDataType: false,
            sortable: false,
        };
    }, []);
    return (
        <div
            className="ag-theme-alpine"
            style={{ height: 400, width: 600 }}
        >
            <AgGridReact
                // gridOptions={gridOptions}
                columnDefs={columnDefs}
                rowData={rowData}
                defaultColDef={defaultColDef}
                suppressColumnVirtualisation={false}
                suppressRowVirtualisation={true}
                domLayout='normal'

            />
        </div>
    );
};

export default GridExample;
