import { useCallback, useState } from 'react';
import Spinner from '@ui/components/spinner/Spinner';

function useLoading() {
  const [loading, setLoading] = useState(true);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  const spinner = <Spinner />;

  return { loading, startLoading, stopLoading, spinner };
}

export default useLoading;
