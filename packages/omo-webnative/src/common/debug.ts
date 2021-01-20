import { setup } from '../setup/internal'

export function newLogger(name:string, parent?:any)
{
  return {
    name,
    parent,
    log: (...args: unknown[]) =>
    {
      if (setup.debug && args?.length)
      {
        const remainingArgs = args.splice(1);
        if (remainingArgs.length)
        {
          if (setup.externalLogger)
          {
            setup.externalLogger(`${Date.now()} [${name}]: ${args[0]}`, remainingArgs);
          } else {
            console.log(`${Date.now()} [${name}]: ${args[0]}`, remainingArgs);
          }
        }
        else
        {
          if (setup.externalLogger)
          {
            setup.externalLogger(`${Date.now()} [${name}]: ${args[0]}`);
          } else {
            console.log(`${Date.now()} [${name}]: ${args[0]}`);
          }
        }
      }
    },
    newLogger: (name:string) => newLogger(name, parent)
  }
}
