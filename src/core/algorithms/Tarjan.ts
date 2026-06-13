export function SCC(
  nodeIds: string[],
  adjList: Record<string, { target: string; weight: number; edgeId: string }[]>,
  isDirected: boolean
): string[][] {
  const components: string[][] = [];

  if (isDirected) {
    let k = 1;
    const num: Record<string, number> = {};
    const min_num: Record<string, number> = {};
    const on_stack: Record<string, boolean> = {};
    const S: string[] = []; // simple stack hihihi

    nodeIds.forEach(id => {
      num[id] = -1;
      on_stack[id] = false;
    });

    const SCC = (u: string) => {
      num[u] = min_num[u] = k;
      k++;
      S.push(u);
      on_stack[u] = true;

      const neighbors = adjList[u] || [];
      for (const edge of neighbors) {
        const v = edge.target;
        if (num[v] < 0) {
          SCC(v);
          min_num[u] = Math.min(min_num[u], min_num[v]);
        } else if (on_stack[v]) {
          min_num[u] = Math.min(min_num[u], num[v]);
        }
      }

      // đỉnh chốt
      if (num[u] === min_num[u]) {
        const component: string[] = [];
        let w;
        do {
          w = S.pop()!;
          on_stack[w] = false;
          component.push(w);
        } while (w !== u);
        components.push(component);
      }
    };

    nodeIds.forEach(id => {
      if (num[id] < 0) SCC(id);
    });
  } else {
    // nếu là vô hướng, dùng bfs
    const visited: Record<string, boolean> = {};

    nodeIds.forEach(startId => {
      if (!visited[startId]) {
        const component: string[] = [];
        const queue = [startId];
        visited[startId] = true;

        while (queue.length > 0) {
          const u = queue.shift()!;
          component.push(u);

          const neighbors = adjList[u] || [];
          for (const edge of neighbors) {
            const v = edge.target;
            if (!visited[v]) {
              visited[v] = true;
              queue.push(v);
            }
          }
        }
        components.push(component);
      }
    });
  }

  return components;
}
