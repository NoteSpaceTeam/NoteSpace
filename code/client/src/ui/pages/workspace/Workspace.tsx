import { DocumentResource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import DocumentView from '@ui/pages/workspace/components/DocumentView';
import useError from '@ui/contexts/error/useError';
import useWorkspace from '@ui/contexts/workspace/useWorkspace';
import './Workspace.scss';

function Workspace() {
  const { workspace, resources, operations } = useWorkspace();
  const { publishError } = useError();

  return (
    <div className="workspace">
      <h2>{workspace?.name}</h2>

      <div className="table">
        <div className="table-row">
          <p>Name</p>
          <p>Created</p>
          <p>Modified</p>
        </div>
        {Object.values(resources || [])
          .filter(resource => resource.type === ResourceType.DOCUMENT)
          .map(resource => (
            <DocumentView
              key={resource.id}
              document={resource as DocumentResource}
              onDelete={() => operations?.deleteResource(resource.id).catch(publishError)}
              onDuplicate={() =>
                operations?.createResource(resource.name + '-copy', ResourceType.DOCUMENT).catch(publishError)
              }
              onRename={name => operations?.updateResource(resource.id, { name }).catch(publishError)}
            />
          ))}
      </div>
    </div>
  );
}

export default Workspace;
