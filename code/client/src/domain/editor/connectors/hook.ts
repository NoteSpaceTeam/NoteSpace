import { useMemo } from 'react';
import { Connectors } from '@domain/editor/connectors/Connectors';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { Communication } from '@services/communication/communication';

export default function (fugue: Fugue, communication: Communication) {
  return useMemo(() => {
    return new Connectors(fugue, communication);
  }, [communication, fugue]);
}
