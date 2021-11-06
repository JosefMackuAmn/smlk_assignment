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

    it('pops from one node', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);

        const poped = queue.pop();
        expect(poped).toEqual(1);

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

    it('pops from two nodes', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);

        const poped = queue.pop();
        expect(poped).toEqual(1);

        expect(queue.head?.value).toEqual(2);
        expect(queue.tail?.value).toEqual(2);
    });

    it('enqueues and pops more nodes', () => {
        const queue = new Queue<number>();
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.length).toEqual(3);
        expect(queue.head?.value).toEqual(3);
        expect(queue.tail?.value).toEqual(1);

        expect(queue.pop()).toEqual(1);
        expect(queue.pop()).toEqual(2);

        expect(queue.length).toEqual(1);
        
        queue.enqueue(4);

        expect(queue.length).toEqual(2);

        expect(queue.pop()).toEqual(3);
        expect(queue.pop()).toEqual(4);
        expect(queue.pop()).toEqual(null);
        expect(queue.length).toEqual(0);
    });
})