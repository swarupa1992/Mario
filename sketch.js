//Mario game

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var life = 4;
var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var bricksGroup, brickImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score = 0;
var gameOverImg,restartImg;
 var jumpSound , checkPointSound, dieSound;

var bg;

function preload(){
  
  mario_running = loadAnimation("mario01.png","mario02.png","mario00.png");
  mario_collided = loadAnimation("mario03.png");
  
  groundImage = loadImage("ground2.png");
  
  bg = loadImage("bg.png");
  
  brickImage = loadImage("brick.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  /*obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");*/
  
  restartImg = loadImage("restart.png")  
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  
  createCanvas(600, 350);
  
  mario = createSprite(50,295,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  

  mario.scale = 2;
  
  ground = createSprite(300,330,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(100,300,400,15);
  invisibleGround.visible = false;
  
  
  bricksGroup = createGroup();
  obstaclesGroup = createGroup();
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
   
  mario.setCollider("rectangle",0,0,mario.width-4,mario.height-4);
  //mario.debug = true;
  
  //score = 0;
  
}

function draw() {
  
  background(bg);
  
  textSize(20);
  fill(0);
  
  //displaying score
  text("Score: "+ score, 490,30);
  text("Life: "+ life, 490,50);
  
  
 
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
     
     mario.changeAnimation("running", mario_running);
    
     
  if(score>0 && score%100 === 0){
    
       checkPointSound.play() 
    }
    
       
   ground.velocityX = -(4 + score /20);
  
  if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
  //jump when the space key is pressed
    
    if(keyDown("space") && mario.y >= 225) {
      
        mario.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    mario.velocityY = mario.velocityY + 0.8
  
  //spawn obstacles on the ground
    spawnObstacles();
       
  
    //spawn the clouds
    spawnBricks();
  for(var i = 0; i< bricksGroup.length;i++){
    if(bricksGroup.get(i).isTouching(mario)){
      
      bricksGroup.get(i).remove();
      score = score + 1;
      
    }
 
  }
    
for(var i = 0; i< obstaclesGroup.length;i++){
  
    if(obstaclesGroup.get(i).isTouching(mario)){
      
      obstaclesGroup.get(i).remove();
      life = life - 1;
      //console.log("life = ", life);
      
    }
 
  }
  
   if(obstaclesGroup.isTouching(mario) ){
        
     life = life -1 ;
        //gameState = END;
        dieSound.play();
     //console.log("life = ", life);
      
    }
    
    if(life <= 0 ){ 
      //console.log(life);
      //console.log("Game state =",gameState);
      gameState = END;
      //console.log("Game state =",gameState);
    }
    
  }//play
  
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
     
     if(mousePressedOver(restart)){
        
          reset();
      }
     
     //change the mario animation
      mario.changeAnimation("collided", mario_collided);
       
      
     
      ground.velocityX = 0;
      mario.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     bricksGroup.setVelocityXEach(0);    
   }
    
  
  
  mario.collide(invisibleGround);
  drawSprites();

}


function reset(){
  
       gameState = PLAY;
  
       gameOver.visible = false;
       restart.visible = false;
  
       score = 0;
  
       obstaclesGroup.destroyEach();
       bricksGroup.destroyEach(); 
     
       score = 0;
       life = 4;
      
  
}


function spawnObstacles(){
  
 if (frameCount % 60 === 0){
   
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -( 6 + score/20);
   
    obstacle.y = Math.round(random(130,180));
    //obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
   
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      
      default: break;
    }
   
    //assign scale and lifetime to the obstacle 
   
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
    obstacle.depth = mario.depth;
    mario.depth = mario.depth + 1;
  
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnBricks() {
  
  // to spawn the bricks
  
 if (frameCount % 60 === 0) {
   
    var brick = createSprite(600,120,40,10);
    brick.y = Math.round(random(120,160));
    brick.addImage(brickImage);
    brick.scale = 1.0;
    brick.velocityX = -(5 + score/20);
    
     //assign lifetime to the variable
   
    brick.lifetime = 200;
    
    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    bricksGroup.add(brick);
  }
}  
