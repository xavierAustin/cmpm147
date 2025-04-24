/* exported generateGrid, drawGrid */
/* global placeTile */


function clamp(x,min,max){
  if (x < min)
    return min;
  if (x > max)
    return max;
  return x;
}
function randomFlt(min,max){
  //return (random() * (max-min)) + min;
  return random(min,max)
}
function randomInt(min,max){
  return Math.floor(randomFlt(min,max+1));
}
function lclzdRand(min,max){
  return (randomFlt(0,(max-min)/2)*randomFlt(0,1)-0.5)+min+(max/2)
}
function lclzdRandInt(min,max){
  return Math.floor(lclzdRand(min,max+1));
}

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("#");
    }
    grid.push(row);
  }
  //generate hallways
  let rooms = randomInt(2,5)
  let x = randomInt(0,numCols-1);
  let y = randomInt(0,numRows-1);
  let first = {x: x, y: y};
  for (let i = 0; i < rooms; i++){
    let tx = randomInt(0,numCols-1);
    let ty = randomInt(0,numRows-1);
    let c = randomInt(0,1);
    if (tx == x && ty == y){
      tx += randomInt(3,10)*Math.sign(randomInt(0,1)-0.5);
      ty += randomInt(3,10)*Math.sign(randomInt(0,1)-0.5);
    }
    if (x > 0 && x < numCols && y > 0 && y < numRows)
        grid[y][x] = "H";
    for (var j =0; (j < 50) && ((x != tx) && (y != ty));j++){
      x += Math.sign(tx-x)*(c);
      y += Math.sign(ty-y)*(!c);
      if (x >= 0 && x < numCols && y >= 0 && y < numRows)
        grid[y][x] = "H";
    }
    for (var security =0; (security < 50) && ((x != tx) || (y != ty));security++){
      x += Math.sign(tx-x)*(!c);
      y += Math.sign(ty-y)*(c);
      if (x >= 0 && x < numCols && y >= 0 && y < numRows)
        grid[y][x] = "H";
    }
    //generate rooms
    let rx = tx;
    let ry = ty;
    let w = 2;
    let h = 2;
    let stop = 0;
    let maxw = randomInt(numCols/4,numCols/2);
    let maxh = randomInt(numRows/4,numRows/2);
    while (w < maxw || h < maxh){
      for (var _x = rx; _x < rx+Math.min(w,maxw); _x++){
        for (var _y = ry; _y < ry+Math.min(h,maxh); _y++){
          stop |= (grid[clamp(_y,0,numRows-1)][clamp(_x,0,numCols-1)] == "_")
        }
      }
      if (stop)
        break;
      w += 2;
      h += 2;
      rx --;
      ry --;
    }
    for (var __x = rx+1; __x < rx+Math.min(w,maxw)-1; __x++){
      for (var __y = ry+1; __y < ry+Math.min(h,maxh)-1; __y++){
        grid[clamp(__y,0,numRows-1)][clamp(__x,0,numCols-1)] = "_"
      }
    }
  }
  //treasure room
  grid[first.y][first.x] = "C";
  //finalize
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] == "#" && (grid[clamp(i+1,0,numRows-1)][j] == "C" || grid[clamp(i+1,0,numRows-1)][j] == "H" || grid[clamp(i+1,0,numRows-1)][j] == "_"))
        grid[i][j] = "%";
      if (grid[clamp(i+1,0,numRows-1)][j] == "#" && grid[i][j] == "%")
        grid[i][j] = "#";
      if (grid[i][j] == "%" && grid[i][clamp(j-1,0,numCols-1)] == "%"
          && grid[i][clamp(j+1,0,numCols-1)] == "#" && !randomInt(0,3))
        grid[i][j] = "D";
    }
  }
  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      switch(grid[i][j]){
        case("%"):
          placeTile(i, j, randomInt(11,14), randomInt(21,24));
        break;
        case("#"):
          placeTile(i, j, randomInt(1,4), randomInt(21,24));
          if (randomInt(0,20))
            placeTile(i, j, 0, 23);
        break;
        case("H"):
        case("_"):
          placeTile(i, j, 20, 23);
          if (!randomInt(0,17) || ((grid[i][clamp(j-1,0,grid[i].length-1)] == "#"
             || grid[i][clamp(j+1,0,grid[i].length-1)] == "#"
             || grid[clamp(i-1,0,grid.length-1)][j] == "%"
             || grid[clamp(i+1,0,grid.length-1)][j] == "#"))&& !randomInt(0,4))
            placeTile(i, j, randomInt(25,28), 24);
        break;
        case("C"):
          placeTile(i, j, 20, 23);
          placeTile(i, j, randomInt(3,5), 28);
        break;
        case("D"):
          placeTile(i, j, 15, 27);
        break;
      }
    }
  }
}


