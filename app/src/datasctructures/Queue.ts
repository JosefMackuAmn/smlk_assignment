import { 
    OnEnqueueFunction,
    PromiseResolveRejectFunction
} from '../types/datastructures/queue';

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
    private _onEnqueue: OnEnqueueFunction = null;

    // Variables needed to resolve listenersDone
    private runningListeners = 0;
    private resolveListenersDoneHook: PromiseResolveRejectFunction|null = null;
    private rejectListenersDoneHook: PromiseResolveRejectFunction|null = null;
    private isListenersDonePending = false;

    // Variable indicating whether all onEnqueue listeners
    // have been completely executed
    public listenersDone: Promise<boolean> = Promise.resolve(true);

    // Setter for a function executed on enqueue
    set onEnqueue(cb: OnEnqueueFunction) {
        if (cb) {
            // Create a wrapper around provided cb
            // resolving listenersDone when no more
            // listeners are running
            this._onEnqueue = async () => {
                try {
                    await cb();
                } catch (err) {
                    // Reject listenersDone
                    this.isListenersDonePending = false;
                    if (this.rejectListenersDoneHook) {
                        this.rejectListenersDoneHook(false);
                    }         
                    this.rejectListenersDoneHook = null;
                    this.resolveListenersDoneHook = null;
                    this.runningListeners--;
                    return;
                }
                this.runningListeners--;

                if (!this.runningListeners) {
                    // Resolve listenersDone
                    this.isListenersDonePending = false;
                    if (this.resolveListenersDoneHook) {
                        this.resolveListenersDoneHook(true);
                    }
                    this.resolveListenersDoneHook = null;
                    this.rejectListenersDoneHook = null;                    
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
            // and hook its resolve and reject function
            if (!this.isListenersDonePending) {
                this.isListenersDonePending = true;
                this.listenersDone = new Promise((resolve, reject) => {
                    this.resolveListenersDoneHook = resolve;
                    this.rejectListenersDoneHook = reject;
                });
            }

            // Increase the number of running listeners
            this.runningListeners++;

            // Call _onEnqueue function
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