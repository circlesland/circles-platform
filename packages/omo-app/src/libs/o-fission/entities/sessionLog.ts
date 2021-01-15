import {Entity} from "./entity";

export class SessionLog implements Entity
{
  name: string;
  messages: {
    message: string,
    args?: any[]
  }[];
}
