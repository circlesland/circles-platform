export interface Flushable {
  flush() : Promise<string>;
}
