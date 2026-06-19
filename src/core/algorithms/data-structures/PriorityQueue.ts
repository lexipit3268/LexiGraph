type QueueElement<T> = {
  element: T;
  priority: number;
};

export class PriorityQueue<T> {
  private heap: QueueElement<T>[] = [];

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  enqueue(element: T, priority: number): void {
    this.heap.push({ element, priority });
    this.siftUp(this.heap.length - 1);
  }

  dequeue(): T | null {
    if (this.isEmpty()) return null;
    if (this.heap.length === 1) return this.heap.pop()!.element;

    const min = this.heap[0].element;
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);

    return min;
  }

  clear(): void {
    this.heap = [];
  }

  private siftUp(index: number): void {
    let curr = index;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (this.heap[curr].priority >= this.heap[parent].priority) break;

      // Swap
      [this.heap[curr], this.heap[parent]] = [this.heap[parent], this.heap[curr]];
      curr = parent;
    }
  }

  private siftDown(index: number): void {
    let curr = index;
    const length = this.heap.length;

    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let smallest = curr;

      if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }

      if (smallest === curr) break;

      // Swap
      [this.heap[curr], this.heap[smallest]] = [this.heap[smallest], this.heap[curr]];
      curr = smallest;
    }
  }
}
