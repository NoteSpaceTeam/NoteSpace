import './Error.scss';
import { MdError } from 'react-icons/md';

type ErrorProps = {
  error?: Error;
};

function Error({ error }: ErrorProps) {
  if (!error) {
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
