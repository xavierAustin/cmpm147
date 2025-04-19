// sketch.js - draws a living scene thats a replica of an image
// Author: Xavier Austin
// Date: 4/18/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

let cnvsSize;// = {x:600,y:600};
let canvasContainer;
let num;
let slugs = [];
let precompSqrtSubX = [];
for (var i = 0; i < 10; i ++){
  precompSqrtSubX.push(Math.round(sqrtSubX(i)));
}

function R(x,y,rad){
  return x*cos(rad)-y*sin(rad)
}

function ColR(r,g,b,a){
  return color(r,g+random(-10,10),b+random(-10,10))
}

function sqrtSubX(x){
  var a = x/5
  return (Math.sqrt(a)-a/2)*50
}

function DrawSlug(aTo,len){
  beginShape();
  //rotate(x,y,angle), rotate(y,-x,angle)
  vertex(R(-20,-20,aTo),R(-20, 20,aTo));
  // controlx0, controly0, controlx1, controly1, anchorx, anchory
  bezierVertex(R(-20,-60,aTo), R(-60, 20,aTo), R(-10,-70,aTo), R(-70, 10,aTo), R(  0,-70,aTo), R(-70,  0,aTo));
  bezierVertex(R( 10,-70,aTo), R(-70,-10,aTo), R( 20,-60,aTo), R(-60,-20,aTo), R( 20,-20,aTo), R(-20,-20,aTo));
  bezierVertex(R( 20, 30,aTo), R( 30,-20,aTo), abs(8*aTo)+20,            len,              0,             len);
  bezierVertex(-abs(8*aTo)-20,            len, R(-20, 30,aTo), R( 30, 20,aTo), R(-20,-20,aTo), R(-20, 20,aTo));
  endShape();
}

function resizeScreen() {
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  setup();
  // redrawCanvas(); // Redraw everything based on new size
}

function setup() {
  //createCanvas(cnvsSize.x, cnvsSize.y,WEBGL);
  canvasContainer = $("#canvas-container");
  cnvsSize = {x:canvasContainer.width(), y:canvasContainer.height(), hx: canvasContainer.width()/2, hy: canvasContainer.height()/2};
  num = max(cnvsSize.x,cnvsSize.y)/3;
  let canvas = createCanvas(cnvsSize.x, cnvsSize.y,WEBGL);
  canvas.parent("canvas-container");
  
  $(window).resize(function() {
    resizeScreen();
  });
  //resizeScreen();
  
  layer0 = createFramebuffer();
  layer1 = createFramebuffer();
  slugBuffer = createFramebuffer();
  onehundred = Math.atan(40);
  generateSlug = function (){
    slug = {
      x : cnvsSize.hx+random(cnvsSize.hx)*random(-1,1),//randomGaussian(cnvsSize.hx, cnvsSize.hx),
      y : cnvsSize.hy+random(cnvsSize.hy)*random(-1,1),//randomGaussian(cnvsSize.hy, cnvsSize.hy),
      rot : random(360),
      rTo : 0,
      rToTo : floor(random(-50,51)),
      rToPrev : 0,
      len : 140,
      spd : random(100,140),
      Update: function(){
        var ang = this.rot*Math.PI/180;
        var time = frameCount/this.spd;
        this.len = (sin(time))*30+120;
        //move back to center if off screen
        if(this.x > cnvsSize.x+140 || this.x < -140 || this.y > cnvsSize.y+140 || this.y < -140){
          var myCntr = createVector(this.x-cnvsSize.hx, this.y-cnvsSize.hy);
          var center = createVector(10,0);
          this.rTo = 0;
          this.rToPrev = 0;
          this.rToTo = 0;
          this.rot = center.angleBetween(myCntr)*180/Math.PI-90;
          //console.log(this.rot)
        }
        //move
        if (cos(time) > 0){
          this.x -= R(0,1,ang)*cos(time)/3;
          this.y -= R(1,0,ang)*cos(time)/3;
          this.rTo = constrain(this.rToTo*(sin(time)+1)+this.rToPrev,-50,50);
        }else{
          this.rot -= Math.sign(this.rTo)*cos(time)/10;
          this.rTo += Math.sign(this.rTo)*cos(time)/10;
          this.rToTo = floor(random(-50,50)*random(0,1));
          this.rToPrev = this.rTo;
        }
      },
      DrawSelf : function(){
        var ang = this.rot*Math.PI/180;
        var aTo = this.rTo*Math.PI/180;
        resetMatrix();
        translate(this.x-cnvsSize.hx, this.y-cnvsSize.hy);
        rotate(ang);
        stroke(64,62,76,125);
        noFill();
        strokeWeight(7);
        DrawSlug(aTo,this.len);
        stroke(64,62,76,75);
        ellipse(R(0,-10,aTo)+3*aTo,R(-10,0,aTo), 48, 48);
        ellipse(R(0, -5,aTo)+4*aTo,R( -5,0,aTo), 48, 48);
        ellipse(             5*aTo,           0, 48, 48);
        stroke(244,222,108,140);
        strokeWeight(3);
        noFill();
        line(R(-10,-60,aTo),R(-60, 10,aTo),R(-30,-85,aTo),R(-85, 30,aTo));
        line(R( 10,-60,aTo),R(-60,-10,aTo),R( 30,-85,aTo),R(-85,-30,aTo));
        fill(244,222,108);
        DrawSlug(aTo,this.len);
        stroke(255,246,122,140);
        fill(255,246,122);
        ellipse(R(0,-10,aTo)+3*aTo,R(-10,0,aTo), 48, 48);
        ellipse(R(0, -5,aTo)+4*aTo,R( -5,0,aTo), 48, 48);
        ellipse(             5*aTo,           0, 48, 48);
      }
    }
	console.log('Generated slug at:'+slug.x+', '+slug.y);
    return slug;
  }
  generateFoliage = function(len,pine,weight,col,back){
    temp = {
      x : random(cnvsSize.x),
      y : random(cnvsSize.y),
      rot : random(360),
      size : {x:random(80,100),xy:random(1.1,1.3)},
      seed : random(),
      DrawSelf: function(){
        var ang = this.rot*Math.PI/180;
        var sx = this.size.x;
        var sy = this.size.x*this.size.xy; 
        resetMatrix();
        translate(this.x-cnvsSize.hx, this.y-cnvsSize.hy);
        rotate(ang);
        //stroke(64,62,76,alpha(back)/4);
        stroke(64,62,76,80);
        strokeWeight(weight*2);
        var flip = 1;
        var wiggle = this.seed;
        for (var i = 0; i < 10; i ++){
          line(0,i*5,(precompSqrtSubX[i])*flip,-30*this.size.xy+i*8);
          if (pine)
            line(0,50+i*5,20*flip,40+i*5);
          flip *= -1;
        }
        line(0,0,0,len);
        stroke(64,62,76,alpha(back)/4);
        strokeWeight(sx+10);
        line(0,1,0,0);
        strokeWeight(sx+4);
        line(0,1,0,0);
        stroke(back);
        strokeWeight(sx);
        line(0,10,0,0);
        stroke(col);
        strokeWeight(weight);
        flip = 1;
        for (var i = 0; i < 10; i ++){
          line(0,i*5,(precompSqrtSubX[i])*flip,-30*this.size.xy+i*8);
          if (pine)
            line(0,50+i*5,20*flip,40+i*5);
          flip *= -1;
        }
        line(0,0,0,len);
      }
    }
    return temp;
  }
  generateLeaf = function (){
    //              Pale Brown,       Grayish,          Gold,             Pale,             Muddy Green,      Green
    possibleCol  = [ColR(177,160,152),ColR(116,116,128),ColR(220,206,138),ColR(248,244,225),ColR(127,133,124),ColR(129,180,135)];
    pssblCmplmnt = [ColR(148,136,124),ColR( 93, 97,103),ColR(249,229,183),ColR(248,244,225),ColR(113,114, 98),ColR(227,249,187)];
    index = floor(random(0,possibleCol.length)*random());
    return generateFoliage(80,0,2,pssblCmplmnt[index],possibleCol[index]);
  }
  generatePine = function (){
    return generateFoliage(100,1,6,ColR(163,113,112),color(0,0,0,0));
  }
  slugs = [generateSlug()];
  for (var i = floor(random(0,num/60)*random()); i > 0; i --){
    slugs.push(generateSlug());
  }
  leafs = [];
  for (var i = 0; i < num; i ++){
    leafs.push(generateLeaf());
    if(random() > 0.6){
      leafs.push(generatePine());
    }
  }
  for(var i = 0; i < leafs.length; i ++){
    layer0.begin();
    leafs[i].DrawSelf();
    layer0.end();
  }
}

function draw() {
  background(48,53,62);
  image(layer0,-cnvsSize.hx,-cnvsSize.hy,cnvsSize.x,cnvsSize.y);
  //background(48,53,62);
  //for(var i = 0; i < leafs.length; i ++){
  //  leafs[i].DrawSelf();
  //  leafs[i].Update();
  //}
  slugBuffer.begin();
  clear();
  for(var i = 0; i < slugs.length; i ++){
    slugs[i].DrawSelf();
    slugs[i].Update();
  }
  slugBuffer.end();
  image(slugBuffer,-cnvsSize.hx,-cnvsSize.hy,cnvsSize.x,cnvsSize.y);
}