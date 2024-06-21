import { useContext } from 'react';
import { WorkspaceContext } from '@/contexts/workspace/WorkspaceContext';

const useWorkspace = () => useContext(WorkspaceContext);

export default useWorkspace;
