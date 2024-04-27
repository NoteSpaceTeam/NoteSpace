# Notespace - March Report
## Introduction
This is the March report for the Notespace project. This report will cover the progress made in March.
> For detailed information on the project structure, please refer to [project structure](../project-overview-report.md) report.

## Project summary

## Progress
As of the 27th of March, the project has made significant progress.
The project has been refactored and optimized for better performance and maintainability.
The conflict resolution algorithm has been updated, and a rich text editor prototype has been implemented using Slate.js.
The project has also been integrated with Firestore for database support.

The following tasks have been completed:

1. ### Project proposal draft & conflict resolution research
A draft for the project's proposal was built and research on conflict algorithms continued.
In the end, a CRDT algorithm was chosen, and we started implementing it. The algorithm itself is called Fugue.
> More details on the conflict resolution algorithms can be found in the 
[ConflictResolution](../features/Editor.md#ConflictResolution) section.


2. ### Fugue CRDT implementation
The earlier versions worked with a string implementation of the algorithm, 
but development proved challenging and hard to maintain, stalling the project's development. 
We then moved to a tree-based implementation, which is the current version. 
The tree-based Fugue CRDT has a simpler design but slightly more network usage, something we are working on optimizing.

3. ### Rich text editor prototype
Works on a rich text editor prototype began, first using BlockNote, 
which is a simple rich text editor that supports basic formatting like bold, italic, and underline.
After encountering some issues with BlockNote, there was a migration from BlockNote to Slate.js, 
a more powerful and flexible rich text editor framework.
It allowed for more customization and features like markdown support, as well as out-of-the-box React integration.

We also started working on the integration of Slate.js with the backend,

4. ### Firestore integration
For database support, Firestore was integrated into the project. This will store document information. 
The early version of the project used a simple in-memory database, but Firestore provides a more robust and scalable solution.
Firestore will store, in the early versions, the full document content, but in the future, it will store only the changes made to the document,
so to optimize the network usage and the performance of the application.

5. ### Code optimization
The project has undergone code optimization to improve performance and maintainability.
This includes refactoring the codebase, optimizing the CRDT algorithm, and improving the overall structure of the project.
We started working on unit tests, and the test-runner chosen were [Vitest](https://vitest.dev) for the client, 
which is faster and more compatible with the project's structure, and Jest for the backend.

6. ### DevOps
We have implemented GitHub Actions for continuous integration and deployment, as well as Dependabot for dependency updates.
This will help automate the testing and deployment process, ensuring that the project remains up-to-date and secure.

## Metrics
### Tasks completed:
  - Project proposal draft & conflict resolution research
  - Fugue CRDT implementation
  - Rich text editor prototype
    - Migration from BlockNote to Slate.js
    - Integration with the backend
  - Firestore integration
  - Code optimization
  - DevOps