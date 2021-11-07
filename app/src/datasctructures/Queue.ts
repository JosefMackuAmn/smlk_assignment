import { PromiseResolveRejectFunction } from "../types/misc";

class QueueNode<T> {
    constructor(
        public value: T,
        public next: QueueNode<T>|null = null
    ) {}
}

class Queue<T> {
    public head: QueueNode<T>|null = null;
    public tail: QueueNode<T>|null = null;
    public length = 0;

    // Private function executed on enqueue
    private _onEnqueue: (() => any)|null = null;

    // Variables needed to determine when to resolve listenersDone
    private runningListeners = 0;
    private resolveListenersDoneHook: PromiseResolveRejectFunction|null = null;
    private isListenersDonePending = false;

    // Variable indicating whether all onEnqueue listeners
    // have been completely executed
    public listenersDone: Promise<boolean> = Promise.resolve(true);

    // Setter for a function executed on enqueue
    set onEnqueue(cb: (() => any)|null) {
        if (cb) {
            // Create a wrapper around provided cb
            // resolving listenersDone when no more
            // listeners are running
            this._onEnqueue = async () => {
                await cb();
                this.runningListeners--;

                if (!this.runningListeners) {
                    // Resolve listenersDone
                    this.isListenersDonePending = false;
                    if (this.resolveListenersDoneHook) {
                        this.resolveListenersDoneHook(true);
                    }
                    this.resolveListenersDoneHook = null;
                    
                }
            };
        } else {
            this._onEnqueue = null;
        }
    }

    enqueue(value: T) {
        const newNode = new QueueNode(value);

        if (this.head) {
            this.head.next = newNode;
        } else {
            this.tail = newNode;
        }

        this.head = newNode;
        this.length++;

        if (this._onEnqueue) {
            // If listenersDone is resolved
            // assign it to a new pending promise
            // and hook its resolve function
            if (!this.isListenersDonePending) {
                this.isListenersDonePending = true;
                this.listenersDone = new Promise((resolve) => {
                    this.resolveListenersDoneHook = resolve;
                });
            }

            this.runningListeners++;

            this._onEnqueue();
        };
    }

    dequeue() {
        const currentTail = this.tail;

        if (!currentTail) {
            return null;
        }

        if (this.length === 1) {
            this.head = null;
        }

        this.tail = currentTail.next;
        this.length--;

        return currentTail.value;
    }

    dequeueAll() {
        const values = [];

        let currentNode = this.tail;
        while (currentNode) {
            values.push(currentNode.value);
            currentNode = currentNode.next;
        }

        this.tail = null;
        this.head = null;
        this.length = 0;

        return values;
    }
}

export { Queue };