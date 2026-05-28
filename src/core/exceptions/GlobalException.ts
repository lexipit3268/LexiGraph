export class GlobalException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GlobalException';
  }
}

export class GraphInputException extends GlobalException {
  constructor(message: string) {
    super(message);
    this.name = 'GraphInputException';
  }
}

export class GraphExportException extends GlobalException {
  constructor(message: string) {
    super(message);
    this.name = 'GraphExportException';
  }
}
