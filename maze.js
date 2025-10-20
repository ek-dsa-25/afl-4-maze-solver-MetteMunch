function randomInteger(min, max) {
  //inkl min og ekskl max
  min = Math.ceil(min); //ceil runder op
  max = Math.floor(max); //floor runder ned
  return Math.floor(Math.random() * (max - min)) + min;
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
    this.visited = false;
  }

  // Hjælpefunktion til generate(): Tegn cellen
  draw(ctx, cellWidth) {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.beginPath();

    const px = this.x * cellWidth;
    const py = this.y * cellWidth;

    ctx.moveTo(px, py);

    if (this.walls.left) {
      ctx.lineTo(px, py + cellWidth);
    } else {
      ctx.moveTo(px, py + cellWidth);
    }

    if (this.walls.bottom) {
      ctx.lineTo(px + cellWidth, py + cellWidth);
    } else {
      ctx.moveTo(px + cellWidth, py + cellWidth);
    }

    if (this.walls.right) {
      ctx.lineTo(px + cellWidth, py);
    } else {
      ctx.moveTo(px + cellWidth, py);
    }

    if (this.walls.top) {
      ctx.lineTo(px, py);
    } else {
      ctx.moveTo(px, py);
    }

    ctx.stroke();
  }

  // Hjælpefunktion til generate(): find naboerne i grid som ikke har været besøgt tidligere vha. this.x og this.y
  unvisitedNeighbors(grid) {
    let neighbors = [];

    // Vi er ikke den nordligste celle
    if (this.y > 0) {
      const nord_x = this.x;
      const nord_y = this.y - 1;
      const nord_nabo = grid[nord_x][nord_y];
      if (!nord_nabo.visited) {
        neighbors.push(nord_nabo);
      }
    }

    // Vi er ikke cellen mest til venstre
    if (this.x > 0) {
      const venstre_x = this.x - 1;
      const venstre_y = this.y;
      const venstre_nabo = grid[venstre_x][venstre_y];
      if (!venstre_nabo.visited) {
        neighbors.push(venstre_nabo);
      }
    }

    // Vi er ikke den sydligste celle
    if (this.y < grid[0].length - 1) {
      const syd_x = this.x;
      const syd_y = this.y + 1;
      const syd_nabo = grid[syd_x][syd_y];
      if (!syd_nabo.visited) {
        neighbors.push(syd_nabo);
      }
    }

    // Vi er ikke cellen mest til højre
    if (this.x < grid.length - 1) {
      const højre_x = this.x + 1;
      const højre_y = this.y;
      const højre_nabo = grid[højre_x][højre_y];
      if (!højre_nabo.visited) {
        neighbors.push(højre_nabo);
      }
    }

    return neighbors;
  }

  // Hjælpefunktion til generate(): Fjerner en væg
  punchWallDown(otherCell) {
    const dx = this.x - otherCell.x;
    const dy = this.y - otherCell.y;

    if (dx === 1) {
      // otherCell er til venstre for this
      this.walls.left = false;
      otherCell.walls.right = false;
    } else if (dx === -1) {
      // otherCell er til højre for this
      this.walls.right = false;
      otherCell.walls.left = false;
    } else if (dy === 1) {
      // otherCell er over this
      this.walls.top = false;
      otherCell.walls.bottom = false;
    } else if (dy === -1) {
      // otherCell er under this
      this.walls.bottom = false;
      otherCell.walls.top = false;
    }
  }

  // Hjælpefunktion til MazeSolver: Finder de naboer som ikke har en væg
  connectedNeighbors(grid) {
    let neighborsWithoutWall = [];

    // Vi er ikke den nordligste celle
    if (this.y > 0) {
      const nord_x = this.x - 0;
      const nord_y = this.y - 1;
      const nordlig_nabo = grid[nord_x][nord_y];
      if (!this.walls.top && !nordlig_nabo.walls.bottom) {
        neighborsWithoutWall.push(nordlig_nabo);
      }
    }

    // Vi er ikke cellen yderst til venstre
    if (this.x > 0) {
      const vest_x = this.x - 1;
      const vest_y = this.y;
      const vestlig_nabo = grid[vest_x][vest_y];
      if (!this.walls.left && !vestlig_nabo.walls.right) {
        neighborsWithoutWall.push(vestlig_nabo);
      }
    }

    // Vi er ikke den sydligste celle
    if (this.y < grid[0].length - 1) {
      const syd_x = this.x;
      const syd_y = this.y + 1;
      const sydlig_nabo = grid[syd_x][syd_y];
      if (!this.walls.bottom && !sydlig_nabo.walls.top) {
        neighborsWithoutWall.push(sydlig_nabo);
      }
    }

    // Vi er ikke cellen mest til højre
    if (this.x < grid.length - 1) {
      const øst_x = this.x + 1;
      const øst_y = this.y;
      const østlig_nabo = grid[øst_x][øst_y];
      if (!this.walls.right && !østlig_nabo.walls.left) {
        neighborsWithoutWall.push(østlig_nabo);
      }
    }
    return neighborsWithoutWall;
  }

  // Hjælpefunktion til MazeSolver: Sammenligner om to celler er ens
  equals(otherCell) {
    return this.x === otherCell.x && this.y === otherCell.y;
  }

  // Hjælpefunktion til MazeSolver
  // Det er denne som tegner stien i den enkelte celle
  drawPath(ctx, cellWidth, color, intensity = 0, pathIndex = 0) {
    let newColor = color;
    console.log("pathIndex", pathIndex);

    // Skift farve for hvert 10'ende step... eftersom jeg vil gøre det i denne funktion som tegner den
    // enkelte celle, så skal jeg have indeks med som parameter
    if (
      (pathIndex > 10 && pathIndex <= 20) ||
      (pathIndex > 30 && pathIndex <= 40) ||
      (pathIndex > 50 && pathIndex <= 60) ||
      (pathIndex > 70 && pathIndex <= 80) ||
      (pathIndex > 90 && pathIndex <= 100) ||
      (pathIndex > 110 && pathIndex <= 120) ||
      (pathIndex > 130 && pathIndex <= 140)
    ) {
      // Skift midlertidig farve
      newColor = "rgba(255, 0, 0)";
    } else {
      newColor = color;
    }

    const [r, g, b] = newColor
      .match(/\d+/g) // find tallene
      .map(Number); // lav dem til rigtige tal

    const newR = Math.min(255, r + intensity);
    const newG = Math.min(255, g + intensity);
    const newB = Math.min(255, b + intensity);

    ctx.fillStyle = `rgb(${newR}, ${newG}, ${newB})`;

    //Jeg vil lave cirkler, så først skal midten af cellen findes
    const cx = this.x * cellWidth + cellWidth / 2;
    const cy = this.y * cellWidth + cellWidth / 2;

    //cirklens radius som en procent af cellens bredde
    const radius = cellWidth * 0.25;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2); // Tegn cirkel
    ctx.fill(); // Fyld cirklen med farve
  }
}

class Maze {
  constructor(cols, rows, canvas) {
    this.grid = [];
    this.cols = cols;
    this.rows = rows;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.cellWidth = canvas.width / cols;
    this.initializeGrid();
  }

  initializeGrid() {
    for (let i = 0; i < this.cols; i += 1) {
      this.grid.push([]);
      for (let j = 0; j < this.rows; j += 1) {
        this.grid[i].push(new Cell(i, j));
      }
    }
  }

  draw() {
    for (let i = 0; i < this.cols; i += 1) {
      for (let j = 0; j < this.rows; j += 1) {
        this.grid[i][j].draw(this.ctx, this.cellWidth);
      }
    }
  }

  generate() {
    const start_x = randomInteger(0, this.cols);
    const start_y = randomInteger(0, this.rows);
    let currentCell = this.grid[start_x][start_y];
    let stack = [];

    currentCell.visited = true;

    // Laver labyrinten efter alm recursive backtracking
    while (currentCell != null) {
      let unvisitedNeighbors = currentCell.unvisitedNeighbors(this.grid);
      if (unvisitedNeighbors.length > 0) {
        const randomNeighborCell =
          unvisitedNeighbors[randomInteger(0, unvisitedNeighbors.length)];
        currentCell.punchWallDown(randomNeighborCell);
        stack.push(currentCell);
        currentCell = randomNeighborCell;
        currentCell.visited = true;
      } else {
        currentCell = stack.pop();
      }
    }
  }
}

class MazeSolver {
  //klasse hvis formål er at finde en vej gennem labyrinten fra et startpunkt til et slutpunkt
  constructor(maze) {
    this.maze = maze;
  }

  resetPathfindingState() {
    //nulstiller alle celler
    for (let i = 0; i < this.maze.rows; i += 1) {
      for (let j = 0; j < this.maze.cols; j += 1) {
        this.maze.grid[i][j].visited = false;
        this.maze.grid[i][j].parent = null; //disse skal bruges til at spore hvor vi har været
      }
    }
  }

  findPath(startX, startY, endX, endY) {
    this.resetPathfindingState();

    const startCell = this.maze.grid[startX][startY];
    const endCell = this.maze.grid[endX][endY];

    // Her løsning vha BFS (queue). Hvad er DFS (stak)?

    let queue = [startCell];
    startCell.visited = true;

    while (queue.length > 0) {
      const current = queue.shift(); //current starter med at startCell, som er den første i queue

      // Hvis nuværende celle er lig med slutcelle, så stopper vi og tegner stien ved at kalde reconstructPath()
      if (current.equals(endCell)) {
        return this.reconstructPath(startCell, current);
      }

      // Tjek naboer uden vægge
      for (const neighbor of current.connectedNeighbors(this.maze.grid)) {
        if (!neighbor.visited) {
          neighbor.visited = true;
          neighbor.parent = current;
          queue.push(neighbor);
        }
      }
    }

    // Ingen vej fundet
    return null;
  }

  //når vejen igennem labyrinten er fundet (slutcellen er nået) bruges denne funktion til at rekonstruere
  //og gemme cellerne / stien ved at følge .parent tilbage fra slutcellen, så stien kan tegnes
  reconstructPath(startCell, endCell) {
    const path = [];
    let currentCell = endCell;

    while (currentCell !== null) {
      path.unshift(currentCell);
      currentCell = currentCell.parent;
    }

    return path.length > 0 && path[0].equals(startCell) ? path : null;
  }

  //Hvis vi ønsker at vejen gennem labyrinten tegnes på en gang, så kaldes denne funktionen, som igen kalder drawPath()
  //som findes i class Cell, og som ved hvordan den enkelte celle skal tegnes
  drawPath(path, color) {
    //denne kalder funktionen drawPath() som findes i class Cell, og som ved hvordan den enkelte celle skal tegnes
    if (!path) return;

    for (const cell of path) {
      cell.drawPath(this.maze.ctx, this.maze.cellWidth, color);
    }
  }

  //Hvis vi ønsker animeret gengivelse af vejen gennem labyrinten, så kaldes denne funktionen, som igen kalder drawPath()
  //som findes i class Cell, og som ved hvordan den enkelte celle skal tegnes
  async drawPathStepwise(path, color, delay = 100) {
    if (!path) return;

    const midPath = Math.floor(path.length / 2);

    for (let i = 0; i < path.length; i++) {
      const cell = path[i];
      let intensity;

      if (i <= midPath) {
        intensity = i * 3;
      } else {
        intensity = (path.length - i) * 3;
      }

      cell.drawPath(this.maze.ctx, this.maze.cellWidth, color, intensity, i);
      await this.sleep(delay);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const maze = new Maze(20, 20, canvas);

  maze.generate();

  maze.draw();

  // Demonstrate pathfinding - find path from top-left to bottom-right
  const solver = new MazeSolver(maze);
  const startX = 0;
  const startY = 0;
  const endX = maze.cols - 1;
  const endY = maze.rows - 1;

  const path = solver.findPath(startX, startY, endX, endY);

  //solver.drawPath(path,"rgb(118, 129, 222)");
  solver.drawPathStepwise(path, "rgba(15, 83, 7, 1)", 20);

  console.log(maze);
});
