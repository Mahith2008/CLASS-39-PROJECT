var runner;
var runningAnimation;
var jumpingAnimation;
var gameBackground;
var platformBackground;
var gameFont;
var gameMusic;
var gameOverMusic;
var jumpSound;
var gameOver = false;
var platformsGroup;
var currentPlatformLocation; //= -width
var gravity = 1;
var jumpPower = 15;
var runnerSpeed = 15;
var currentBackgroundTilePosition;
var backgroundTiles;
var playerScore = 0;

function preload(){

  jumpingAnimation = loadAnimation(
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump00.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump01.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump02.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump03.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump04.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump05.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump06.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump07.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump08.png',     
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/jump09.png'    
  );
  runningAnimation = loadAnimation(
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run00.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run01.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run02.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run03.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run04.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run05.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run06.png', 
    'https://la-wit.github.io/build-an-infinite-runner/build/images/sprites/adventureWoman/run07.png'   
  );
  gameBackground = loadImage('https://la-wit.github.io/build-an-infinite-runner/build/images/environments/defaultBackground.png');
platformBackground = loadImage('https://la-wit.github.io/build-an-infinite-runner/build/images/environments/defaultPlatform.png');
gameFont = loadFont('https://la-wit.github.io/build-an-infinite-runner/build/fonts/ARCADE_R.TTF');
gameMusic = loadSound('https://la-wit.github.io/build-an-infinite-runner/build/sounds/generic-game-loop-4.mp3');
gameOverMusic = loadSound('https://la-wit.github.io/build-an-infinite-runner/build/sounds/over.mp3');
jumpSound = loadSound('https://la-wit.github.io/build-an-infinite-runner/build/sounds/jump07.mp3');
}

function setup(){
  createCanvas(840,390);
runner = createSprite(50,100,25,40);
runner.scale = 1.5
runner.addAnimation('jump', jumpingAnimation);
runner.addAnimation('run', runningAnimation);
runner.setCollider("rectangle", 0,0,10,41);
runner.depth = 5;
platformsGroup = new Group;
currentBackgroundTilePosition = -width;
backgroundTiles = new Group;
gameMusic.play();
            
}
function draw(){

  if(!gameOver){
  background(200);

  ellipse(mouseX,mouseY,30,30);
  fill(23,55,100);

  addNewPlatforms();
  runner.velocity.y += gravity;
  runner.collide(platformsGroup, solidGround);
  runner.velocity.x = runnerSpeed;    
  camera.position.x = runner.position.x + 300;


  addNewBackgroundTiles();
removeOldBackgroundTiles();



  updateScore();
  jumpDetection();
  removeOldPlatforms();
  fallCheck();
  drawSprites();
  }
  
  if(gameOver){
    gameOverText();
    updateSprites(false);
if(keyWentDown("R")){
    newGame();

  }
  }
  
}

function addNewPlatforms(){
  if(platformsGroup.length < 5){
    var currentPlatformLength = 1132;
    var platform = createSprite((currentPlatformLocation * 1.3), random(300,400), 1132, 336);
    platform.collide(runner);
    currentPlatformLocation += currentPlatformLength;
    platform.addAnimation('default', platformBackground);
    platform.depth = 3;
    platformsGroup.add(platform);
  }
}

function solidGround(){
  runner.velocity.y = 0;
  runner.changeAnimation("run");
  if(runner.touching.right){
    runner.velocity.x = 0;
    runner.velocity.y+= 30;
  }
}

function jumpDetection(){
  if(keyWentDown("Space")){
    runner.changeAnimation("jump");
   // runner.animation.rewind();
    runner.velocity.y = -jumpPower;
  }
}

function removeOldPlatforms(){
  for(var i = 0; i < platformsGroup.length; i++){
      if((platformsGroup[i].position.x) < runner.position.x-width){
        platformsGroup[i].remove();
    }
  }
}

function addNewBackgroundTiles(){
  if(backgroundTiles.length < 3){
    currentBackgroundTilePosition += 839;
    var bgLoop = createSprite(currentBackgroundTilePosition, height/2, 840, 390);
    bgLoop.addAnimation('bg', gameBackground);
    bgLoop.depth = 1;
    backgroundTiles.add(bgLoop);
  }
}

function removeOldBackgroundTiles(){
  for(var i = 0; i < backgroundTiles.length; i++){
      if((backgroundTiles[i].position.x) < runner.position.x-width){
        backgroundTiles[i].remove();
    }
  }
}
            
function fallCheck(){
  if(runner.position.y > height){
      gameOver = true;
      gameMusic.stop();
      gameOverMusic.play();
    }
}    

function gameOverText(){
  background(0,0,0,10);
  fill('white');
  stroke('black')
  textAlign(CENTER);
  textFont(gameFont);

  strokeWeight(2);
  textSize(90);
  strokeWeight(10);
  text("GAME OVER", camera.position.x, camera.position.y);

  textSize(20);
text("You ran " + playerScore + ' yards!', camera.position.x, camera.position.y + 50);

textSize(30);
text("PRESS R TO RESTART", camera.position.x, camera.position.y + 100);


}

function newGame(){
  platformsGroup.removeSprites();
  backgroundTiles.removeSprites();
  gameOver = false;
  updateSprites(true);
  runnerSpeed = 15;
  runner.position.x = 50;
  runner.position.y = 100;
  runner.velocity.x = runnerSpeed;
  currentPlatformLocation = -width;
  currentBackgroundTilePosition = -width;
  playerScore = 0;
  gameOverMusic.stop();
  gameMusic.play();
}

function updateScore(){
  if(frameCount % 60 === 0){
    playerScore++;
  }
  fill('white');
  textFont(gameFont);
  strokeWeight(2);
  stroke('black');
  textSize(20);
  textAlign(CENTER);
  text(playerScore, camera.position.x + 350, camera.position.y + 160);
}
          
