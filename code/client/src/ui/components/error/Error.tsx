import './Error.scss';
import { MdError } from 'react-icons/md';
import { useEffect, useRef, useState } from 'react';

type ErrorProps = {
  error?: Error;
};

function Error({ error }: ErrorProps) {
  const [err, setErr] = useState<Error | undefined>(error);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (errorRef.current && !errorRef.current.contains(event.target as Node)) {
        setErr(undefined);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!err) {
    return null;
  }

  return (
    <div className="error" role="alert" ref={errorRef}>
      <span>
        <MdError />
      </span>
      <p>{err.message}</p>
    </div>
  );
}

export default Error;
