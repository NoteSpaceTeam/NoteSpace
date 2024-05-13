import WorkspaceHeader from '@ui/pages/workspace/components/WorkspaceHeader';
import DocumentView from '@ui/pages/workspace/components/DocumentView.tsx';
import useError from '@domain/error/useError';
import useWorkspaceTreeOperations from '@ui/pages/workspace/hooks/useWorkspaceTreeOperations.ts';
import './Workspace.scss';
import useWorkspace from '@domain/workspace/useWorkspace.ts';
import { DocumentResourceMetadata, ResourceType } from '@notespace/shared/src/workspace/types/resource.ts';

function Workspace() {
  const { workspace } = useWorkspace()
  const { publishError } = useError();

  const {
    resources,
    createResource,
    deleteResource,
    updateResource
  } = useWorkspaceTreeOperations();

  return (
    <div className="workspace">
      <h2>Workspace {workspace?.name}</h2>
      <WorkspaceHeader onCreateNew={() => createResource(ResourceType.DOCUMENT).catch(publishError)}></WorkspaceHeader>
      <ul className="items">
        {resources.map(resource => (
          resource.type === ResourceType.DOCUMENT
            ? <DocumentView
              key={resource.id}
              document={resource as DocumentResourceMetadata}
              onDelete={() => deleteResource(resource.id).catch(publishError)}
              onDuplicate={() => createResource(ResourceType.DOCUMENT, resource.name).catch(publishError)}
              onRename={name => updateResource(resource.id, {name}).catch(publishError)}
            />
            : <></>
        ))}
      </ul>
    </div>
  );
}

export default Workspace;
