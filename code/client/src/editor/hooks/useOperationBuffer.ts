import {useEffect, useState} from "react";

type useOperationBufferProps = {
  insertLocal: (data: string, start: number, end: number) => string[];
  deleteLocal: (start: number, end: number) => (string | undefined)[];
  insertRemote: (data: string[]) => void;
  deleteRemote: (data: string[]) => void;
};

function useOperationBuffer(operations: useOperationBufferProps) {
  const [operationBuffer, setOperationBuffer] = useState<OperationData[]>([]);
  useEffect(() => {
    function operationHandler({ type, data }: OperationData) {
      switch (type) {
        case 'insert': {
          operations.insertRemote(data);
          break;
        }
        case 'delete': {
          operations.deleteRemote(data);
          break;
        }
      }
    }
    if (operationBuffer.length === 0) return;
    operationHandler(operationBuffer[0]);
    setOperationBuffer(prev => prev.slice(1));
  }, [operationBuffer, operations]);
  return {setOperationBuffer};
}

export default useOperationBuffer;
