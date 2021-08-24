/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, trex_running, trex_collided;
var jungle, invisiblejungle;
var invisibleGround;
var shrubs
var obstaclesGroup, obstacle1;

var score;
var gameOverImg;
var restartImg;
var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800,400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle", jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;


  gameOver=createSprite(400,200,400,20);
  gameOver.addImage("gameover",gameOverImg)
  gameOver.scale=0.9;
  gameOver.visible=false;
 restart=createSprite(400,300,400,40);
 restart.addImage("restarts",restartImg);
 restart.scale=0.09;
 restart.visible=false;

  kangaroo = createSprite(400,240,400,20);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("jumping", kangaroo_collided );
  kangaroo.scale=0.09;



  invisibleGround = createSprite(200,390,400,10);
  invisibleGround.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  

  kangaroo.setCollider("rectangle",0,0,kangaroo.width,kangaroo.height);
  kangaroo.debug = false
  score = 0;

}

function draw() {
  background(255);
  
  kangaroo.x=camera.position.x-270;


  

  if(gameState === PLAY){


     // gameOver.visible = false;
    //  restart.visible = false;
   
      //assiging ground velocity
      jungle.velocityX = -3;
      
      //scoring
     // score = score + Math.round(getFrameRate()/60);
 
      // reseting the ground
      if (jungle.x < 0){
        jungle.x = jungle.width/11;
      }
      
      //jump when the space key is pressed
      if(keyDown("space")&& kangaroo.y >= 308) {
        kangaroo.velocityY = -18;
          jumpSound.play();
      }
     
      //add gravity
      kangaroo.velocityY = kangaroo.velocityY + 0.8
    
    
      //spawnClouds();
      spawnShrub();
      spawnObstacles();
      
      if(shrubsGroup.isTouching(kangaroo)){
        shrubsGroup .destroyEach()
        collidedSound.play();
       score=score+1;
       //   gameState = END;
        //  dieSound.play()
     }  
     if(obstaclesGroup.isTouching(kangaroo)){
      obstaclesGroup .destroyEach();
      collidedSound.play();
      
     gameState=END
    }
  
  }else if (gameState === END) {
    shrubsGroup .destroyEach();
    obstaclesGroup .destroyEach();
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    //kangaroo.velocityX=0;
    kangaroo.changeAnimation("jumping")
    jungle.x = width /1000;
    gameOver.visible=true;
    restart.visible=true;
    if(mousePressedOver(restart))
        
      {reset();
      }
  }else if (gameState === WIN) {

    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    //change the trex animation
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }
  kangaroo.collide(invisibleGround);

  
  drawSprites();

  fill("red")
  textSize(20)
  text("Score: "+ score, camera.position.x,50);
  textSize(30);
  fill("green")
  text("get 7 score to win",560,50)
  if(score>=7){
    kangaroo.visible=false;
    textSize(20);
    stroke(3);
    fill("blue");
    text("Congratulations On Winning This Game!!",70,200);
    gameState=WIN;
  }
}



function spawnShrub(){
  if (frameCount % 150 === 0){
    
    //creating obstacle sprite
    shrubs = createSprite(camera.position.x+500,330,40,10);
    shrubs.velocityX = -(4 + 3*score/1)
    shrubs.scale=0.05;
    shrubs.lifetime=200;
    shrubsGroup.add(shrubs);
     //generate random obstacles
     var rand = Math.round(random(1,3));
     switch(rand) {
       case 1: shrubs.addImage(shrub1);
               break;
       case 2: shrubs.addImage(shrub2);
               break;
       case 3: shrubs.addImage(shrub3);
               break;
      
       default: break;
     }
  }

}




function spawnObstacles(){
  if (frameCount % 170 === 0){
    var obstacle=createSprite(560,350,100,100);
     obstacle.addImage("obstacles",obstacle1);
     obstacle.velocityX = -7;
     obstacle.scale=0.09;
     obstacle.lifetime=200;
     obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState=PLAY;  
  gameOver.visible=false;
  restart.visible=false;
  shrubsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  kangaroo.changeAnimation( "running", kangaroo_running);
    score=0
  }
  