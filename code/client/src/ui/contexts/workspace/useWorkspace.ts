import { useContext } from 'react';
import { WorkspaceContext } from '@ui/contexts/workspace/WorkspaceContext';

const useWorkspace = () => useContext(WorkspaceContext);

export default useWorkspace;
