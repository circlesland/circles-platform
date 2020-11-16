import {Subject} from "rxjs";

export class EventBroker
{
    public constructor()
    {
    }

    private _topics: { [namespace: string]: { [name: string]: Topic<any> } } = {};

    /**
     * Creates a new topic and assigns it a unique name.
     * @param namespace A namespace
     * @param name The unique topic name within the namespace
     */
    public createTopic<T>(namespace: string, name: string): Topic<T>
    {
        if (this._topics[name])
        {
            throw new Error(`A topic with the name ${name} already exists.`)
        }

        const topic = new Topic<T>(namespace, name);
        let ns = this._topics[namespace];
        if (!ns)
        {
            ns = this._topics[namespace] = {};
        }
        ns[name] = topic;

        return topic;
    }

    /**
     * Gets an existing topic.
     * @param namespace
     * @param name
     */
    public getTopic<T>(namespace: string, name: string): Topic<T>
    {
        const ns = this._topics[namespace];
        if (!ns)
        {
            throw new Error(`There is no namespace with the name '${namespace}'.`)
        }

        const topic = ns[name];
        if (!topic)
        {
            throw new Error(`There is no topic with the name '${name}' in the namespace '${namespace}'.`)
        }

        return topic;
    }

    public tryGetTopic<T>(namespace: string, name: string): Topic<T> | null
    {
        const ns = this._topics[namespace];
        if (!ns)
        {
            return null;
        }

        const topic = ns[name];
        if (!topic)
        {
            return null;
        }

        return topic;
    }

    removeTopic(namespace: string, name: string)
    {
        throw new Error("Not implemented");
    }
}

export class Topic<T>
{
    /**
     * The name of the topic (must be unique within the namespace)
     */
    public get name(): string
    {
        return this._name;
    }

    private _name: string;

    public get namespace(): string
    {
        return this._namespace;
    }

    private _namespace: string;

    /**
     * The event source for regular subscribers.
     */
    public get observable(): Subject<T>
    {
        return this._observable;
    }

    private _observable: Subject<T>;

    constructor(namespace: string, name: string)
    {
        this._namespace = namespace;
        this._name = name;

        this._observable = new Subject<T>();
    }

    /**
     * Publishes a new fire-and-forget event to the topic.
     * @param event
     */
    public async publish(event: T): Promise<void>
    {
        // First fulfill all dependencies..
        const promises: Promise<void>[] = [];
        for (let dep of this.dependencies)
        {
            promises.push(dep(event));
        }

        await Promise.all(promises);
        this._observable.next(event);
    }

    /**
     * Contains all dependency handlers which will be processed in a blocking manner before everything else.
     */
    private dependencies: ((T) => Promise<void>)[] = [];

    /**
     * Can be used instead of a subscription to the 'observable' property but blocks until all
     * dependencies are processed.
     * Dependencies are processed before any normal events are dispatched.
     * @param dependency The actual promise-returning callback
     */
    public depend(dependency: (T) => Promise<void>)
    {
        this.dependencies.push(dependency);
    }
}
