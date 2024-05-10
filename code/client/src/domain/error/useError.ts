import { useContext } from 'react';
import { ErrorContext } from '@domain/error/ErrorContext';

const useError = () => useContext(ErrorContext);

export default useError;
