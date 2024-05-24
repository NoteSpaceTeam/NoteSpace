import { ReactNode, useState } from 'react';
import { Checkbox } from '@mui/material';
import { FaSortDown, FaSortUp } from 'react-icons/fa6';

type DataTableProps = {
  columns: string[];
  selectedAll: boolean;
  setSelectedAll: (selected: boolean) => void;
  createButton: ReactNode;
  deleteButton: ReactNode;
  sortRows: (column: string, ascending: boolean) => void;
  children: ReactNode;
};

function DataTable({
  columns,
  createButton,
  deleteButton,
  setSelectedAll,
  selectedAll,
  sortRows,
  children,
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState('');
  const [ascending, setAscending] = useState(true);
  return (
    <div className="table">
      {selectedAll ? deleteButton : createButton}
      <div className="table-content">
        <div className="table-header">
          <Checkbox checked={selectedAll} onChange={() => setSelectedAll(!selectedAll)} />
          {columns.map(column => (
            <div key={column}>
              <button
                onClick={() => {
                  if (sortColumn === column) {
                    setAscending(!ascending);
                  } else {
                    setSortColumn(column);
                    setAscending(true);
                  }
                  sortRows(column, ascending);
                }}
              >
                {column}
                {sortColumn === column && (ascending ? <FaSortUp /> : <FaSortDown />)}
              </button>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export default DataTable;
