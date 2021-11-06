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

    enqueue(value: T) {
        const newNode = new QueueNode(value);

        if (this.head) {
            this.head.next = newNode;
        } else {
            this.tail = newNode;
        }

        this.head = newNode;
        this.length++;
    }

    pop() {
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
}

export { Queue };