/**
 * We get this type filled in globally from the symbol-observable package, but if consumers of
 * redoodle don't consume either symbol-observable or redux (which also fills in this global type),
 * then consumers of redoodle will fail Typescript compilation without skipLibCheck turned on.
 * Filling the type in here so that it is emitted in redoodle's type declaration files.
 */

declare global {
  export interface SymbolConstructor {
    readonly observable: symbol;
  }
}

export {};
