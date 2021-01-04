var END = 0;
var PLAY = 1;
var gameState = PLAY;

var trex, trexRunning, trexCollided;
var ground, invisibleGround, groundImage;

var cloudGroup, cloudImage;
var ObstacleGroup, O1, O2, O3, O4, O5, O6;

var score = 0;

var gameOver, restart;

function preload(){

trexRunning = loadAnimation("trex1.png","trex2.png","trex3.png");
trexCollided = loadAnimation("trex_collided.png");

groundImage = loadImage("ground2.png");
cloudImage = loadImage("cloud.png");

O1 = loadImage("obstacle1.png");
O2 = loadImage("obstacle2.png");
O3 = loadImage("obstacle3.png");
O4 = loadImage("obstacle4.png");
O5 = loadImage("obstacle5.png");
O6 = loadImage("obstacle6.png");

gameOverImage = loadImage("gameOver.png");
restartImage = loadImage("restart.png");

}

function setup(){
createCanvas(600, 200);

trex = createSprite(70, 165, 20, 40);

trex.addAnimation("running", trexRunning);
trex.addAnimation("collided", trexCollided);
trex.scale = 0.5;

ground = createSprite(200,180,400,20);
ground.addImage("ground", groundImage);
ground.x = ground.width/2;
ground.velocityX = -(6 + 3*score/100);

gameOver = createSprite(300,100);
gameOver.addImage(gameOverImage);
gameOver.scale = 0.5;
gameOver.visible = false;

restart = createSprite(300,150);
restart.addImage(restartImage);
restart.scale = 0.5;
restart.visible = false;

invisibleGround = createSprite(200,190,400,10);
invisibleGround.visible = false;

cloudsGroup = new Group();
ObstacleGroup = new Group();

}

function draw(){
//trex.debug = true;

background("lightblue");

if(gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

}

if(keyDown("space") && trex.y >=159){
    trex.velocityY = -12;
}

//This is the gravity function. When you add more to the Y velocity, it slowly brings the trex down.  
trex.velocityY = trex.velocityY + 0.8;

if(ground.x < 0){
    ground.x = ground.width/2;
}

trex.collide(invisibleGround)

spawnClouds();
spawnObstacles();

if(ObstacleGroup.isTouching(trex)){
    gameState = END;
}

else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;

    //We are stopping the trex's movement with the following few lines. 
    ground.velocityX = 0;
    trex.velocityY = 0;

    ObstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //Here we are changing the trex animation. 
    trex.changeAnimation("collided", trexCollided);

    //Here, we are setting a lifetime for the game objects so that they are never destroyed. 
    ObstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
}

drawSprites();
text("Score: " + score, 530,20);
}

function spawnClouds() {
    //This function releases clouds at different y positions. 
    if (frameCount % 60 === 0) {
      var cloud = createSprite(600,120,40,10);
      cloud.y = Math.round(random(80,120));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      
       //This assigns the clouds lifetime. 
      cloud.lifetime = 200;
      
      //This ensures that the clouds are going to be behind the trex depth. 
      cloud.depth = trex.depth;
      trex.depth = trex.depth + 1;
      
      //Here we are adding the clouds to the cloudsGroup. 
      cloudsGroup.add(cloud);
    }
    
  }
  
  function spawnObstacles() {
    if(frameCount % 60 === 0) {
      var obstacle = createSprite(600,165,10,40);
      //obstacle.debug = true;
      obstacle.velocityX = -(6 + 3*score/100);
      
      //The code below generates random obstacles. 
      var rand = Math.round(random(1,6));
      switch(rand) {
        case 1: obstacle.addImage(O1);
                break;
        case 2: obstacle.addImage(O2);
                break;
        case 3: obstacle.addImage(O3);
                break;
        case 4: obstacle.addImage(O4);
                break;
        case 5: obstacle.addImage(O5);
                break;
        case 6: obstacle.addImage(O6);
                break;
        default: break;
      }
      
      obstacle.scale = 0.5;
      obstacle.lifetime = 300;
      ObstacleGroup.add(obstacle);
    }
  }
  
  function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    ObstacleGroup.destroyEach();
    cloudsGroup.destroyEach();
    
    trex.changeAnimation("running",trexRunning);
    
    if(localStorage["HighestScore"]<score){
      localStorage["HighestScore"] = score;
    }
    console.log(localStorage["HighestScore"]);
    
    score = 0;
    
  }