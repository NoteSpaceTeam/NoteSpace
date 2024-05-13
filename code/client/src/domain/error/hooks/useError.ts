import { useContext } from 'react';
import { ErrorContext } from '@domain/error/hooks/ErrorContext.tsx';

const useError = () => useContext(ErrorContext);

export default useError;
