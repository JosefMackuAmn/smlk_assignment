import { Queue } from '../Queue';

describe('class Queue', () => {
    it('enqueues node', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);

        expect(queue.head).toBeDefined();
        expect(queue.tail).toBeDefined();
        expect(queue.head?.value).toEqual(1);
        expect(queue.tail?.value).toEqual(1);
        expect(queue.length).toEqual(1);
    });

    it('dequeues from one node', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);

        const dequeueed = queue.dequeue();
        expect(dequeueed).toEqual(1);

        expect(queue.length).toEqual(0);
        expect(queue.head).toEqual(null);
        expect(queue.tail).toEqual(null);
    });

    it('enqueues second node', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);

        expect(queue.head).toBeDefined();
        expect(queue.tail).toBeDefined();
        expect(queue.tail?.value).toEqual(1);
        expect(queue.head?.value).toEqual(2);
        expect(queue.length).toEqual(2);
    });

    it('dequeues from two nodes', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);

        const dequeueed = queue.dequeue();
        expect(dequeueed).toEqual(1);

        expect(queue.head?.value).toEqual(2);
        expect(queue.tail?.value).toEqual(2);
    });

    it('enqueues and dequeues more nodes', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.length).toEqual(3);
        expect(queue.head?.value).toEqual(3);
        expect(queue.tail?.value).toEqual(1);

        expect(queue.dequeue()).toEqual(1);
        expect(queue.dequeue()).toEqual(2);

        expect(queue.length).toEqual(1);
        
        queue.enqueue(4);

        expect(queue.length).toEqual(2);

        expect(queue.dequeue()).toEqual(3);
        expect(queue.dequeue()).toEqual(4);
        expect(queue.dequeue()).toEqual(null);
        expect(queue.length).toEqual(0);
    });

    it('dequeues everything', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);
        queue.enqueue(4);

        const values = queue.dequeueAll();

        expect(queue.tail).toEqual(null);
        expect(queue.head).toEqual(null);
        expect(queue.length).toEqual(0);
        expect(values).toEqual([1, 2, 3, 4]);
    })

    it('listens for enqueue', () => {
        const queue = new Queue<number>();

        let enqueuedCount = 0;
        queue.onEnqueue = () => {
            enqueuedCount++;
        }

        queue.enqueue(1);
        queue.enqueue(2);

        expect(enqueuedCount).toEqual(2);
    });

    it('executes onEnqueue on enqueue', async () => {
        const queue = new Queue<number>();

        let testValue = 0;
        queue.onEnqueue = () => {
            testValue = 1;
        };

        queue.enqueue(1);

        expect(testValue).toEqual(1);
    });

    it('resolves Queue.listenersDone on completion of all listeners', async () => {
        const queue = new Queue<number>();

        const testValues: number[] = [];

        queue.onEnqueue = async () => {
            const value = queue.dequeue();
            return await new Promise((resolve) => {
                setTimeout(() => {
                    if (value!==null) {
                        testValues.push(value);
                    }
                    resolve(true);
                }, 20);
            });
        }

        for (let i = 0; i < 5; i++) {
            queue.enqueue(i);
        }

        await queue.listenersDone;

        expect(testValues).toEqual([0,1,2,3,4])
    });
    
    it('resolves Queue.listenersDone on completion of all listeners', async () => {
        const queue = new Queue<number>();

        const testValues: number[] = [];

        queue.onEnqueue = async () => {
            const value = queue.dequeue();
            return await new Promise((resolve) => {
                setTimeout(() => {
                    if (value!==null) {
                        testValues.push(value);
                    }
                    resolve(true);
                }, 20);
            });
        }

        for (let i = 0; i < 5; i++) {
            queue.enqueue(i);
        }

        await queue.listenersDone;

        expect(testValues).toEqual([0,1,2,3,4])
    });
})