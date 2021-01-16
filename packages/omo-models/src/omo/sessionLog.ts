import {Entity} from "./entity";

export class SessionLog implements Entity
{
  name: string;
  messages: {
    message: string,
    args?: unknown[]
  }[];

  constructor(name:string)
  {
    this.name = name;
    this.messages = [];
  }
}
