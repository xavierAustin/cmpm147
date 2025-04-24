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
function pointDistance(x0,y0,x1,y1){
  return Math.sqrt(Math.pow(Math.abs(x0-x1),2)+Math.pow(Math.abs(y0-y1),2))
}

function generateGrid(numCols, numRows) {
  let grid = [];
  let gNum = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    let rNum = [];
    for (let j = 0; j < numCols; j++) {
      row.push("#");
      rNum.push(0);
    }
    grid.push(row);
    gNum.push(rNum);
  }
  //generate height map
  for (let i = 0; i < 40; i++){
    let w = randomInt(numCols/5,numCols/2);
    let h = randomInt(numRows/5,numRows/2);
    let init = {
      x: randomInt(0,numCols-1),
      y: randomInt(0,numRows-1),
      n: Math.sign(randomInt(0,1)-0.5),
    }
    init.md = pointDistance(init.x,init.y,init.x+w/2,init.y+h/2)
    for (let x = init.x; x < numCols && x < init.x+w; x++){
      for (let y = init.y; y < numRows && y < init.y+h; y++){
        let dist = pointDistance(x,y,init.x+w/2,init.y+h/2)/Math.max(numRows,numCols);
        gNum[y][x] += init.n * (dist-init.md/Math.max(numRows,numCols))
      }
    }
  }
  //finalize height map
  //console.log(gNum)
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      gNum[i][j] = Math.round(gNum[i][j]*10);
    }
  }
  //convert hight map to grid
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = "w";
      if (gNum[i][j] > 2)
        grid[i][j] = "t";
      else if (gNum[i][j] > 0)
        grid[i][j] = ":";
      else if (gNum[i][j] > -2)
        grid[i][j] = ".";
    }
  }
  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      // map adjacencies
      let adj = [];
      //adj[4] is always 1
      // 0 3 6
      // 1 4 7
      // 2 5 8
      switch(grid[i][j]){
        case("w"):
          for (let x = -1; x < 2; x++)
            for (let y = -1; y < 2; y++)
              adj.push(grid[clamp(i+y,0,grid.length-1)][clamp(j+x,0,grid[0].length-1)] == "w");
          placeTile(i, j, randomInt(0,3)*randomInt(0,1)*randomInt(0,1), 14);
          if (adj[1] && adj[3] && adj[5] && adj[7])
            ;
          //edges
          else if (adj[1] && adj[3] && adj[5])
            placeTile(i, j, 6, 1);
          else if (adj[1] && adj[3] && adj[7])
            placeTile(i, j, 5, 2);
          else if (adj[1] && adj[5] && adj[7])
            placeTile(i, j, 5, 0);
          else if (adj[3] && adj[5] && adj[7])
            placeTile(i, j, 4, 1);
          //corners
          else if (adj[3] && adj[7])
            placeTile(i, j, 4, 2);
          else if (adj[1] && adj[3])
            placeTile(i, j, 6, 2);
          else if (adj[1] && adj[5])
            placeTile(i, j, 6, 0);
          else if (adj[5] && adj[7])
            placeTile(i, j, 4, 0);
          //straights
          else if (adj[1] && adj[7]){
            placeTile(i, j, 5, 2);
            placeTile(i, j, 5, 0);
          }else if (adj[3] && adj[5]){
            placeTile(i, j, 4, 1);
            placeTile(i, j, 6, 1);
          //ends
          }else if (adj[1]){
            placeTile(i, j, 6, 2);
            placeTile(i, j, 6, 0);
          }else if (adj[3]){
            placeTile(i, j, 4, 2);
            placeTile(i, j, 6, 2);
          }else if (adj[5]){
            placeTile(i, j, 4, 0);
            placeTile(i, j, 6, 0);
          }else if (adj[7]){
            placeTile(i, j, 4, 2);
            placeTile(i, j, 4, 0);
          //singles
          }else{
            placeTile(i, j, 4, 2);
            placeTile(i, j, 4, 0);
            placeTile(i, j, 6, 2);
            placeTile(i, j, 6, 0);
          }
        break;
        case("."):
          placeTile(i, j, randomInt(0,3)*randomInt(0,1)*randomInt(0,1), 0);
        break;
        case(":"):
          for (let x = -1; x < 2; x++)
            for (let y = -1; y < 2; y++){
              let temp = grid[clamp(i+y,0,grid.length-1)][clamp(j+x,0,grid[0].length-1)];
              adj.push(temp == "t" || temp == ":");
            }
          placeTile(i, j, randomInt(0,3)*randomInt(0,1)*randomInt(0,1), 6);
          if (adj[1] && adj[3] && adj[5] && adj[7])
            ;
          //edges
          else if (adj[1] && adj[3] && adj[5])
            placeTile(i, j, 6, 1);
          else if (adj[1] && adj[3] && adj[7])
            placeTile(i, j, 5, 2);
          else if (adj[1] && adj[5] && adj[7])
            placeTile(i, j, 5, 0);
          else if (adj[3] && adj[5] && adj[7])
            placeTile(i, j, 4, 1);
          //corners
          else if (adj[3] && adj[7])
            placeTile(i, j, 4, 2);
          else if (adj[1] && adj[3])
            placeTile(i, j, 6, 2);
          else if (adj[1] && adj[5])
            placeTile(i, j, 6, 0);
          else if (adj[5] && adj[7])
            placeTile(i, j, 4, 0);
          //straights
          else if (adj[1] && adj[7]){
            placeTile(i, j, 5, 2);
            placeTile(i, j, 5, 0);
          }else if (adj[3] && adj[5]){
            placeTile(i, j, 4, 1);
            placeTile(i, j, 6, 1);
          //ends
          }else if (adj[1]){
            placeTile(i, j, 6, 2);
            placeTile(i, j, 6, 0);
          }else if (adj[3]){
            placeTile(i, j, 4, 2);
            placeTile(i, j, 6, 2);
          }else if (adj[5]){
            placeTile(i, j, 4, 0);
            placeTile(i, j, 6, 0);
          }else if (adj[7]){
            placeTile(i, j, 4, 2);
            placeTile(i, j, 4, 0);
          //singles
          }else{
            placeTile(i, j, 4, 2);
            placeTile(i, j, 4, 0);
            placeTile(i, j, 6, 2);
            placeTile(i, j, 6, 0);
          }
          
        break;
        case("t"):
          for (let x = -1; x < 2; x++)
            for (let y = -1; y < 2; y++)
              adj.push(grid[clamp(i+y,0,grid.length-1)][clamp(j+x,0,grid[0].length-1)] == "t");
          placeTile(i, j, 0, 6);
          if (adj[1] && adj[3] && adj[5] && adj[7])
            placeTile(i, j, 16, 1);
          else if (adj[1] && adj[3] && adj[5])
            placeTile(i, j, 17, 1);
          else if (adj[1] && adj[3] && adj[7])
            placeTile(i, j, 16, 2);
          else if (adj[1] && adj[5] && adj[7])
            placeTile(i, j, 16, 0);
          else if (adj[3] && adj[5] && adj[7])
            placeTile(i, j, 15, 1);
          else
            placeTile(i, j, 14, 0);
        break;
      }
    }
  }
}


