import { ReactNode, useState } from 'react';
import { Checkbox } from '@mui/material';
import { GoSortAsc, GoSortDesc } from 'react-icons/go';
import './DataTable.scss';
import { useAuth } from '@/contexts/auth/useAuth';

type DataTableProps = {
  columns: string[];
  hasSelected: boolean;
  onSelectAll: (value: boolean) => void;
  createButton: ReactNode;
  deleteButton: ReactNode;
  sortRows: (column: string, ascending: boolean) => void;
  children: ReactNode;
};

function DataTable({
  columns,
  createButton,
  deleteButton,
  hasSelected,
  onSelectAll,
  sortRows,
  children,
}: DataTableProps) {
  const [selectedAll, setSelectedAll] = useState(false);
  const [sortColumn, setSortColumn] = useState('');
  const [ascending, setAscending] = useState(true);
  const { isLoggedIn } = useAuth();

  function onSelectAllRows() {
    setSelectedAll(!selectedAll);
    onSelectAll(!selectedAll);
  }

  return (
    <div className="table">
      {isLoggedIn && (hasSelected ? deleteButton : createButton)}
      <div className="table-content">
        <div className="table-header">
          <Checkbox checked={selectedAll} onChange={onSelectAllRows} />
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
                {sortColumn === column && (ascending ? <GoSortAsc /> : <GoSortDesc />)}
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
