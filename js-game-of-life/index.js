const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

class Universe {
  constructor() {
    this.width = 128;
    this.height = 128;

    this.cells = [];
    let cellCount = 0;
    for (let i = 0; i < this.height; i++) {
      let row = [];
      for (let j = 0; j < this.width; j++) {
        if (cellCount % 2 == 0 || cellCount % 7 == 0) {
          row.push(1);
        } else {
          row.push(0);
        }
        cellCount += 1;
      }
      this.cells.push(row);
    }
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getCells() {
    return this.cells;
  }

  getLiveNeighborCount(row, col) {
    let count = 0;
    count += this.setCellValueHelper(row - 1, col - 1);
    count += this.setCellValueHelper(row - 1, col);
    count += this.setCellValueHelper(row - 1, col + 1);
    count += this.setCellValueHelper(row, col - 1);
    count += this.setCellValueHelper(row, col + 1);
    count += this.setCellValueHelper(row + 1, col - 1);
    count += this.setCellValueHelper(row + 1, col);
    count += this.setCellValueHelper(row + 1, col + 1);
    return count;
  }

  setCellValueHelper(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this.cells[row][col];
    }
    return 0;
  }

  tick() {
    let nextCells = [];
    for (let row = 0; row < this.height; row++) {
      let nextRow = [];
      for (let col = 0; col < this.width; col++) {
        const live_neighbors = this.getLiveNeighborCount(row, col);
        let nextCell;
        // Rule 1: Any live cell with fewer than two live neighbours
        // dies, as if caused by underpopulation.
        if (this.cells[row][col] === 1 && live_neighbors < 2) {
          nextCell = 0;
        }
        // Rule 2: Any live cell with two or three live neighbours
        // lives on to the next generation.
        else if (
          this.cells[row][col] === 1 &&
          (live_neighbors === 2 || live_neighbors === 3)
        ) {
          nextCell = 1;
        }
        // Rule 3: Any live cell with more than three live
        // neighbours dies, as if by overpopulation.
        else if (this.cells[row][col] === 1 && live_neighbors > 3) {
          nextCell = 0;
        }
        // Rule 4: Any dead cell with exactly three live neighbours
        // becomes a live cell, as if by reproduction.
        else if (this.cells[row][col] === 0 && live_neighbors === 3) {
          nextCell = 1;
        }
        // All other cells remain in the same state.
        else {
          nextCell = this.cells[row][col];
        }

        nextRow.push(nextCell);
      }
      nextCells.push(nextRow);
    }

    this.cells = nextCells;
  }
}

// Construct the universe, and get its width and height.
const universe = new Universe();
const width = universe.getWidth();
const height = universe.getHeight();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

let animationId = null;

const renderLoop = () => {
  fps.render();

  drawGrid();
  drawCells();

  universe.tick();

  animationId = requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const drawCells = () => {
  const cells = universe.getCells();

  ctx.beginPath();

  // Alive cells.
  ctx.fillStyle = ALIVE_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (cells[row][col] !== 1) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  // Dead cells.
  ctx.fillStyle = DEAD_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (cells[row][col] !== 0) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const isPaused = () => {
  return animationId === null;
};

const playPauseButton = document.getElementById("play-pause");

const play = () => {
  playPauseButton.textContent = "⏸";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "▶";
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener("click", (event) => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

const fps = new (class {
  constructor() {
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = (1 / delta) * 1000;

    // Save only the latest 100 timings.
    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    // Render the statistics.
    this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
  }
})();

drawGrid();
drawCells();
play();
