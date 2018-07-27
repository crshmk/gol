var defaultBoard = [ [0,0,0], [0,0,0], [0,0,0] ]

var adder = adder = (x, y) => x + y

var Mtx = function(mtx) {
  this.mtx = mtx || defaultBoard
}

/**
 * slice rows to grab neighbors, accounting for unindexed values
 */
Mtx.prototype.slice = (i, arr) =>
  arr.slice(Math.max(i-1, 0), Math.min(i+2, arr.length))

Mtx.prototype.isAlive = function(state) {
  return state === 1;
}

Mtx.prototype.shouldComeAlive = function(numLiveNeighbors) {
  return numLiveNeighbors === 3;
}

Mtx.prototype.shouldStayAlive = function(numLiveNeighbors) {
  return numLiveNeighbors === 2 || numLiveNeighbors === 3;
}

/**
 * make an array of the neighbors and the cell and sum that array
 */
Mtx.prototype.sumArea = function(y, x) {
  return this.slice(y, this.mtx)
  .reduce( (acc, ys) => acc.concat(this.slice(x, ys)), [])
  .reduce(adder, 0)
}

/**
 * if the cell is alive, subtract 1 from the area sum
 */
Mtx.prototype.sumNeighbors = function(y, x) {
  return this.isAlive(this.mtx[y][x]) ?
    this.sumArea(y, x, this.mtx) - 1 :
    this.sumArea(y, x, this.mtx)
}

/**
 * iterative update for each cell
 */
Mtx.prototype.cellState = function(y, x) {
  var numLiveNeighbors = this.sumNeighbors(y, x, this.mtx)
  return this.mtx[y][x] > 0 ?
    this.shouldStayAlive(numLiveNeighbors) ? 1 : 0 :
    this.shouldComeAlive(numLiveNeighbors) ? 1 : 0
}

/**
 * returns a new matrix
 */
Mtx.prototype.forward = function() {
  this.mtx = this.mtx.map( (ys, y) =>
    ys.map( (xs, x) =>
      this.cellState(y, x, this.mtx) ))
}

/**
 * define a getter to read the state of the board
 */
Object.defineProperty(Mtx.prototype, 'board', {
  get: function() { return this.mtx }
})
