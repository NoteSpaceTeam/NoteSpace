import { MarkdownConnector } from '@domain/editor/connectors/markdown/types';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';
import { InputConnector } from '@domain/editor/connectors/input/types';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { Communication } from '@services/communication/communication';
import inputConnector from '@domain/editor/connectors/input/connector';
import markdownConnector from '@domain/editor/connectors/markdown/connector';
import serviceConnector from '@domain/editor/connectors/service/connector';

export class Connectors {
  private readonly inputConnector: InputConnector;
  private readonly markdownConnector: MarkdownConnector;
  private readonly serviceConnector: ServiceConnector;

  constructor(fugue: Fugue, communication: Communication) {
    this.serviceConnector = serviceConnector(fugue, communication);
    this.inputConnector = inputConnector(fugue, this.serviceConnector);
    this.markdownConnector = markdownConnector(fugue, this.serviceConnector);
  }

  get input(): InputConnector {
    return this.inputConnector;
  }

  get markdown(): MarkdownConnector {
    return this.markdownConnector;
  }

  get service(): ServiceConnector {
    return this.serviceConnector;
  }
}
