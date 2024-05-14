import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentView from '@ui/pages/workspace/components/DocumentView.tsx';
import useError from '@domain/error/hooks/useError.ts';
import './Workspace.scss';
import useWorkspace from '@domain/workspaces/hooks/useWorkspace.ts';
import { DocumentResourceMetadata, ResourceType } from '@notespace/shared/src/workspace/types/resource.ts';

function Workspace() {
  const { workspace, resources, operations } = useWorkspace();
  const { publishError } = useError();

  return (
    <div className="workspace">
      <h2>Workspace {workspace?.name}</h2>
      <WorkspaceHeader
        onCreateNew={async () => operations?.createResource('Untitled', ResourceType.DOCUMENT).catch(publishError)}
      ></WorkspaceHeader>
      <ul className="items">
        {resources
          ?.filter(resource => resource.type === ResourceType.DOCUMENT)
          .map(resource => (
            <DocumentView
              key={resource.id}
              document={resource as DocumentResourceMetadata}
              onDelete={() => operations?.deleteResource(resource.id).catch(publishError)}
              onDuplicate={() => operations?.createResource(resource.name + "-copy", ResourceType.DOCUMENT).catch(publishError)}
              onRename={name => operations?.updateResource(resource.id, { name }).catch(publishError)}
            />
          ))}
      </ul>
    </div>
  );
}

export default Workspace;
