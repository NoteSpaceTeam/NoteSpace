import { DocumentsRepository, NoteSpaceDatabase, ResourcesRepository, WorkspacesRepository } from '@databases/types';
import { MemoryResourcesDB } from '@databases/resources/memory/MemoryResourcesDB';
import { MemoryWorkspacesDB } from '@databases/resources/memory/MemoryWorkspacesDB';

export class MemoryDB implements NoteSpaceDatabase {
    readonly document: DocumentsRepository;
    readonly resource: ResourcesRepository;
    readonly workspace: WorkspacesRepository;

    constructor(document: DocumentsRepository) {
        this.document = document;
        this.resource = new MemoryResourcesDB();
        this.workspace = new MemoryWorkspacesDB();
    }
}