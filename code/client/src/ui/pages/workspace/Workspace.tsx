import { DocumentResource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import DocumentView from '@ui/pages/workspace/components/DocumentView';
import useWorkspace from '@/contexts/workspace/useWorkspace';
import { useEffect, useState } from 'react';
import DataTable from '@ui/components/table/DataTable';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { getDocuments, sortDocuments } from '@domain/workspaces/utils';
import './Workspace.scss';

function Workspace() {
  const { workspace, resources, operations } = useWorkspace();
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState<DocumentResource[]>([]);

  useEffect(() => {
    const docs = getDocuments(resources);
    setRows(docs);
  }, [resources]);

  return (
    <div className="workspace">
      <h2>Documents in {workspace?.name}</h2>
      <DataTable
        columns={['Name', 'Created', 'Modified']}
        hasSelected={selected.length > 0}
        onSelectAll={value => setSelected(value ? rows.map(document => document.id) : [])}
        createButton={
          <button onClick={() => operations?.createResource('Untitled', ResourceType.DOCUMENT)}>
            <FaPlus />
          </button>
        }
        deleteButton={
          <button
            onClick={() => {
              selected.forEach(document => {
                operations?.deleteResource(document);
              });
              setSelected([]);
            }}
          >
            <MdDelete />
          </button>
        }
        sortRows={(column, ascending) => {
          setRows(() => sortDocuments([...rows], column, ascending));
        }}
      >
        {rows.map(document => (
          <DocumentView
            key={document.id}
            document={document}
            selected={selected.includes(document.id)}
            onSelect={value =>
              setSelected(prev => (value ? [...prev, document.id] : prev.filter(id => id !== document.id)))
            }
            onDelete={() => operations?.deleteResource(document.id)}
            onDuplicate={() => operations?.createResource(document.name + '-copy', ResourceType.DOCUMENT)}
            onRename={name => operations?.updateResource(document.id, { name })}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default Workspace;
