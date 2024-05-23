import useSortableData from '@ui/components/data-table/useSortableData';

type DataTableProps = {
  columns: string[];
  data: string[];
};

function DataTable({ columns, data }: DataTableProps) {
  if (!data.length) throw new Error('No data provided');

  const { items, sort, sortConfig } = useSortableData(data);
  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th
              key={column}
              onClick={() => sort(column)}
              className={sortConfig && sortConfig.key === column ? sortConfig.direction : undefined}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            {columns.map(column => (
              <td key={column}>{item}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
