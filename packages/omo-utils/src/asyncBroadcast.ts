export class AsyncBroadcast<TIn,TOut>
{
  private _executor:(input:TIn) => Promise<TOut>;
  private _operations: {
    input: TIn,
    subscribers: {
      resolve: (result:TOut) => void,
      reject: (error:any) => void
    }[]
  }[] = [];

  constructor(executor:(input:TIn) => Promise<TOut>)
  {
    this._executor = executor;
  }

  private async dispatch(input:TIn)
  {
    const key:any = input ?? "__undefined__";
    try
    {
      const result = await this._executor(key);

      const pendingOperationIndex = this._operations.findIndex(op => op.input === key);
      const pendingOperation = this._operations[pendingOperationIndex];
      pendingOperation.subscribers.forEach(subscriber => {
        subscriber.resolve(result);
      });
      this._operations.splice(pendingOperationIndex, 1);
    }
    catch (e)
    {
      const pendingOperationIndex = this._operations.findIndex(op => op.input === key);
      const pendingOperation = this._operations[pendingOperationIndex];
      pendingOperation.subscribers.forEach(subscriber => {
        subscriber.reject(e);
      });
      this._operations.splice(pendingOperationIndex, 1);
    }
  }

  async subscribeToResult(input:TIn) : Promise<TOut>
  {
    const key:any = input ?? "__undefined__";
    return new Promise<TOut>((resolve, reject) =>
    {
      const pendingOperation = this._operations.find(op => op.input === key);
      if (!pendingOperation)
      {
        this._operations.push({
          input: key,
          subscribers: [{
            reject,
            resolve
          }]
        });

        this.dispatch(key);
      }
      else
      {
        pendingOperation.subscribers.push({
          resolve,
          reject
        })
      }
    });
  }
}
