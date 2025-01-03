import PriorityQueue from "js-priority-queue";

function isInsideGrid(i, j, grid) {
    return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;
}

const astar = (grid, startNode, endNode) => {
    let arr = grid;
    let visited_nodes = [];
    let shortestPath = [];
    let pq = new PriorityQueue({
        comparator: function (a, b) {
            const fA = a.distance + heuristic(a, endNode);
            const fB = b.distance + heuristic(b, endNode);
            return fA - fB;
        }
    });

    const heuristic = (node, endNode) => {
        return Math.abs(node.row - endNode[0]) + Math.abs(node.col - endNode[1]); // Manhattan distance
    };

    let dx = [1, 0, -1, 0, 1, -1, -1, 1];
    let dy = [0, 1, 0, -1, -1, 1, -1, 1];

    // Initialize grid
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            arr[i][j].distance = Infinity;
            arr[i][j].prevNode = null;
            arr[i][j].isVisited = false;
            arr[i][j].isShortestPath = false;
        }
    }

    let start_node = arr[startNode[0]][startNode[1]];
    start_node.distance = 0;
    pq.queue(start_node);

    while (pq.length) {
        let cell = pq.dequeue();
        if (arr[cell.row][cell.col].isVisited) continue;

        arr[cell.row][cell.col].isVisited = true;
        visited_nodes.push(cell);

        if (cell.row === endNode[0] && cell.col === endNode[1]) {
            let node = cell;
            while (node !== null) {
                shortestPath.unshift(node);
                node.isShortestPath = true;
                node = node.prevNode;
            }
            break;
        }

        for (let i = 0; i < dx.length; i++) {
            let x = cell.row + dx[i];
            let y = cell.col + dy[i];
            if (!isInsideGrid(x, y, arr)) continue;

            let neighbor = arr[x][y];
            if (!neighbor.isVisited && (!neighbor.isWall || (x === endNode[0] && y === endNode[1]))) {
                const dist = Math.abs(dx[i]) === 1 && Math.abs(dy[i]) === 1 ? 1.4 : 1;
                if (cell.distance + dist < neighbor.distance) {
                    neighbor.distance = cell.distance + dist;
                    neighbor.prevNode = cell;
                    pq.queue(neighbor);
                }
            }
        }
    }

    return { visited_nodes, shortestPath };
};

export default astar;
