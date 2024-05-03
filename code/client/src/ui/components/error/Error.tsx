import './Error.scss';
import { MdError } from 'react-icons/md';
import { useState, useEffect } from 'react';

type ErrorProps = {
  error: Error;
};

const ERROR_TIMEOUT = 5000;

function Error({ error }: ErrorProps) {
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setShowError(false);
    }, ERROR_TIMEOUT);
    return () => clearTimeout(id);
  }, []);

  if (!showError) {
    return null;
  }

  return (
    <div className="error" role="alert">
      <span>
        <MdError />
      </span>
      <p>{error.message}</p>
    </div>
  );
}

export default Error;
