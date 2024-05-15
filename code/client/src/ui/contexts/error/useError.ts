import { useContext } from 'react';
import { ErrorContext } from '@ui/contexts/error/ErrorContext';

const useError = () => useContext(ErrorContext);

export default useError;
