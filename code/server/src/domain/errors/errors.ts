function error(name: string) {
  return class extends Error {
    constructor(message?: string) {
      super(message);
      this.name = name;
    }
  };
}

export const NotFoundError = error('NotFoundError');
export const InvalidParameterError = error('InvalidParameterError');
export const ForbiddenError = error('ForbiddenError');
