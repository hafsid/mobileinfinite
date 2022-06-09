var edges;
var back,backImg;
var invisible_ground;
var boy,boyImg,pause_boy;
var ob1,ob2,ob3,ob4,ob5,ob6,ob7,obsG,obstacle;
var coin,coinImg,coinG;
var brick,brickG,brickImg;
var invisible_brick,invisible_brickG;
var gameState = "start"
var start,startImg;
var score = 0;
var gameOver,gameOverImg;
var pause,pauseImg,play,playImg;
var die,point,jump;
var restart,restartImg;

function preload(){

  backImg = loadImage("images/back.jpg");

  boyImg = loadAnimation("images/runner_01.png","images/runner_02.png","images/runner_03.png","images/runner_04.png","images/runner_05.png","images/runner_06.png","images/runner_07.png","images/runner_08.png")
  pause_boy = loadAnimation("images/pauseBoy.png")

  ob1 = loadImage("images/ob1.png");
  ob2 = loadImage("images/ob2.png");
  ob3 = loadImage("images/ob3.png");
  ob4 = loadImage("images/ob4.png");
  ob5 = loadImage("images/ob5.png");
  ob6 = loadImage("images/ob6.png");
  ob7 = loadImage("images/ob7.png");

  coinImg = loadAnimation("images/c1.png","images/c2.png","images/c3.png","images/c4.png","images/c5.png","images/c6.png")

  brickImg = loadImage("images/brick.png");

  startImg = loadImage("images/start.png");

  gameOverImg=loadImage("images/gameover.png");

  pauseImg = loadImage("images/pause.png");
  playImg = loadImage("images/play.png");

  restartImg = loadImage("images/restart.png");

  die = loadSound("sounds/die.wav")
  point = loadSound("sounds/point.mp3")
  jump = loadSound("sounds/jump.wav")

}

function setup(){
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth; 
    canH = displayHeight; 
    createCanvas(displayWidth+80, displayHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  
  back = createSprite(width/2 +100,height-500,width,2);
  back.addImage("back",backImg);
  back.scale = 1.5;
  //back.x = width/2
  invisible_ground = createSprite(width/2 +10,height-60,width,2);
  invisible_ground.visible = false;

  boy = createSprite(50,height-100);
  boy.addAnimation("boy",boyImg);
  boy.addAnimation("pause",pause_boy)
  boy.scale = 0.9

  start = createSprite(width/2,height/2)
  start.addImage(startImg); 
  start.scale = 0.2

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg)
  gameOver.scale = 1
  gameOver.visible = false;

  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  edges = createEdgeSprites();

  pause = createSprite(width/2 -400,30);
  pause.addImage(pauseImg)
  pause.scale = 0.4
  play = createSprite(width/2 -450,30);
  play.addImage(playImg)
  play.scale = 0.4
  play.visible = false;

  obsG = new Group();
  coinG = new Group();
  brickG = new Group();
  invisible_brickG = new Group();
  //boy.debug = true
  boy.setCollider("rectangle",0,0,60,100)
 
}

function draw(){
  background("lightgray")

  if(gameState === "start"){

    start.visible=true;
    back.velocityX =0;
    boy.velocityY=0;
    obsG.setVelocityXEach(0);
    coinG.setVelocityXEach(0);
    invisible_brickG.setVelocityXEach(0)
    brickG.setVelocityXEach(0);
    boy.visible=false;

    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(start)){
      gameState="play"
      touches = []
    }

  }
  if(gameState === "play"){
    boy.changeAnimation("boy",boyImg)
    start.visible=false;
    boy.visible=true;
    back.velocityX = -4;
  if(back.x <0){
    back.x = back.width/2
  }
 
  if(touches.length > 0 || keyDown("UP_ARROW") && boy.y>= height-200 ){
    boy.velocityY = -10
    jump.play();
    touches = [];
  }

  boy.velocityY+=0.5;

  boy.collide(invisible_ground);

  spawnObs();
  spawnCoinandbricks();
  spawncoins();

  if(boy.isTouching(brickG)){
    boy.velocityY =0;
  }
  if(boy.isTouching(invisible_brickG)|| boy.isTouching(obsG)){
    gameState = "end"
    die.play()
  }
  if(boy.isTouching(coinG)){
    coinG[0].destroy();
    score+=1
    point.play();
  }

  if(touches.length>0 || keyDown("SPACE") && gameState === "play"){
    gameState = "pause"
    touches = []
  }
  
 
  }
  if(gameState==="pause"){
    boy.changeAnimation("pause",pause_boy)
    play.visible=true
    back.velocityX =0;
    boy.velocityY=0;
    obsG.setVelocityXEach(0);
    coinG.setVelocityXEach(0);
    invisible_brickG.setVelocityXEach(0)
    brickG.setVelocityXEach(0);

    if(mousePressedOver(play)&& gameState==="pause"){
      gameState = "play";
      play.visible = false;
      pause.visible = true;
      obsG.setVelocityXEach(-4);
      coinG.setVelocityXEach(-4);
      invisible_brickG.setVelocityXEach(-4)
      brickG.setVelocityXEach(-4);

    }
  }
  if(gameState === "end"){
    
    gameOver.visible = true;
    restart.visible = true;
    back.velocityX =0;
    boy.velocityY=0;
    obsG.setVelocityXEach(0);
    coinG.setVelocityXEach(0);
    invisible_brickG.setVelocityXEach(0)
    brickG.setVelocityXEach(0);

    obsG.setLifetimeEach(-1);
    coinG.setLifetimeEach(-1);
    invisible_brickG.setLifetimeEach(-1)
    brickG.setLifetimeEach(-1);

    boy.visible=false;

    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)){
      reset();
    }
  }

    
  drawSprites();
 // fill("red")
 // text(mouseX+","+mouseY,mouseX,mouseY)

  stroke("green")
  strokeWeight(2)
  fill("white")
  textSize(30)
  text("Score: "+score,40,40)
}

function reset(){
  score = 0;
  gameState = "play"
  boy.visible=true;
  obsG.setVelocityXEach(-4);
  coinG.setVelocityXEach(-4);
  invisible_brickG.setVelocityXEach(-4)
  brickG.setVelocityXEach(-4);
  gameOver.visible = false
  restart.visible = false
  obsG.destroyEach();
  coinG.destroyEach();
  invisible_brickG.destroyEach()
  brickG.destroyEach();

}

function spawnObs(){

  if(frameCount % 120 ===0 ){
    obstacle  = createSprite(600,height-95,20,30)
    obstacle.velocityX = -4;

    var rand = Math.round(random(1,7))

    switch(rand){
      case 1: obstacle.addImage(ob1);
      break;
      case 2: obstacle.addImage(ob2);
      break;
      case 3: obstacle.addImage(ob3);
      break;
      case 4: obstacle.addImage(ob4);
      break;
      case 5: obstacle.addImage(ob5);
      break;
      case 6: obstacle.addImage(ob6);
      break;
      case 7: obstacle.addImage(ob7);
      break;
      default:break;
    }
    obstacle.lifetime = 600;
    obsG.add(obstacle);
    gameOver.depth = obstacle.depth;
    gameOver.depth+=1
  }
}

function spawnCoinandbricks(){
  if(frameCount%150 === 0){
    coin = createSprite(600 ,500);
    coin.addAnimation("coin",coinImg);
    coin.velocityX = -4;
    coin.y = Math.round(random(150,200));
    coin.scale = 0.3;
    coin.lifetime = 600;
    coinG.add(coin);
    brick = createSprite(600 ,500);
    brick.addAnimation("brick",brickImg);
    brick.velocityX = -4;
    //brick.y = Math.round(random(100,400));
    brick.scale = 0.3;
    brick.lifetime = 600;
    brickG.add(brick);

    brick.y = coin.y+40
    invisible_brick = createSprite(600,500,150,10);
    //brick.addAnimation("brick",brickImg);
    invisible_brick.velocityX = -4;
    //brick.y = Math.round(random(100,400));
  //  brick.scale = 0.3;
  invisible_brick.lifetime = 600;
  invisible_brickG.add(invisible_brick);
  invisible_brick.visible = false;

  invisible_brick.y = coin.y+50

  gameOver.depth = brick.depth;
  gameOver.depth+=1
  gameOver.depth = coin.depth;
  gameOver.depth+=1

 // brick.debug = true

  }
}

function spawncoins(){
  if(frameCount%100 === 0){
    coin = createSprite(600,500);
    coin.addAnimation("coin",coinImg);
    coin.velocityX = -4;
    coin.y = Math.round(random(300,450));
    coin.scale = 0.3;
    coin.lifetime = 600;
    coinG.add(coin);
  }
}
