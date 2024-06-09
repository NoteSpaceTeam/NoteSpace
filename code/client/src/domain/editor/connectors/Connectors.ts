import { MarkdownConnector } from '@domain/editor/connectors/markdown/types';
import { ServiceConnector } from '@domain/editor/connectors/services/connector';
import { InputConnector } from '@domain/editor/connectors/input/types';
import { HistoryConnector } from '@domain/editor/connectors/history/types';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { Communication } from '@services/communication/communication';
import inputConnector from '@domain/editor/connectors/input/connector';
import markdownConnector from '@domain/editor/connectors/markdown/connector';
import historyConnector from '@domain/editor/connectors/history/connector';
import serviceConnector from '@domain/editor/connectors/services/connector';

export class Connectors {
  private readonly inputConnector: InputConnector;
  private readonly markdownConnector: MarkdownConnector;
  private readonly historyConnector: HistoryConnector;
  private readonly serviceConnector: ServiceConnector;

  constructor(fugue: Fugue, communication: Communication) {
    this.serviceConnector = serviceConnector(fugue, communication);
    this.inputConnector = inputConnector(fugue, this.serviceConnector);
    this.markdownConnector = markdownConnector(fugue, this.serviceConnector);
    this.historyConnector = historyConnector(fugue, this.serviceConnector);
  }

  get input(): InputConnector {
    return this.inputConnector;
  }

  get markdown(): MarkdownConnector {
    return this.markdownConnector;
  }

  get history(): HistoryConnector {
    return this.historyConnector;
  }

  get service(): ServiceConnector {
    return this.serviceConnector;
  }
}
