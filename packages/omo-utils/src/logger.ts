export type Logger = {
    name:string;
    parent?:Logger;
    log:(...args: unknown[]) => void,
    newLogger: (name:string) => Logger
}

export function newLogger(name:string, parent:Logger, send: (message:{message:string, args?:unknown[]}) => void)
{
    const l: Logger = {
        name,
        parent,
        newLogger: (name:string) => newLogger(name, l, send),
        log: (...args: unknown[]) =>
        {
            if (args?.length)
            {
                let current:Logger|undefined = l;
                const pathParts = [];
                while (current)
                {
                    pathParts.unshift(current.name);
                    current = current.parent;
                }
                const path = pathParts.join("/");
                const remainingArgs = args.splice(1);
                if (remainingArgs.length)
                {
                    console.log(`${Date.now()} [${path}]: ${args[0]}`, remainingArgs);
                    send({
                        message: `${Date.now()} [${path}]: ${args[0]}`,
                        args: remainingArgs
                    });
                }
                else
                {
                    console.log(`${Date.now()} [${path}]: ${args[0]}`);
                    send({
                        message: `${Date.now()} [${path}]: ${args[0]}`,
                        args: undefined
                    });
                }
            }
        },
    };

    return l;
}
