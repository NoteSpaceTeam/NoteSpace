import { useContext } from 'react';
import { WorkspaceContext } from '@domain/workspaces/hooks/WorkspaceContext.tsx';

const useWorkspace = () => useContext(WorkspaceContext);

export default useWorkspace;
