import { useContext } from 'react';
import { WorkspaceContext } from '@domain/workspace/WorkspaceContext';

const useWorkspace = () => useContext(WorkspaceContext);

export default useWorkspace;
