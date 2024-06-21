import { useContext } from 'react';
import { ErrorContext } from '@/contexts/error/ErrorContext';

const useError = () => useContext(ErrorContext);

export default useError;
