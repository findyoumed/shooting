// 캔버스 세팅
let canvas;
let ctx;
mainCanvas = document.createElement("canvas");
ctx = mainCanvas.getContext("2d");
mainCanvas.width = 400;
mainCanvas.height = 700;
document.body.appendChild(mainCanvas);

//https://icons8.com/ 무료 아이콘

//
let backgroundImage, playerImage, bulletImage, enemyImage, gameOverImage;
let gameOver=false; //true이면 게임이 끝남, false이면 게임이 안끝남
//플레이어 좌표 계속 바뀜
let playerX = mainCanvas.width / 2 - 58 / 2;
let playerY = mainCanvas.height - 58;
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.png";

  playerImage = new Image();
  playerImage.src = "images/player.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";
}

let keysDown = {};

function setupKeyboardListner() {
  document.addEventListener("keydown", function (event) {
    console.log("무슨 키가 눌렸어?", event.keyCode);
    keysDown[event.keyCode] = true;
    console.log("키다운객체에 들어간 값은?", keysDown);
  });
}
document.addEventListener("keyup", function (event) {
  delete keysDown[event.keyCode];
  console.log("키 클릭후 키에서 손땜", keysDown);
  //만약에 어떤 키를 클릭을 했을 때, 스페이스바가 눌리면, 키코드 32
  //총알을 만든다
  if (event.keyCode == 32) {
    createBullet(); //총알생성
  }
});

function createBullet() {
  console.log("총알생성!");
  let shotBullet = new Bullet();
  shotBullet.init();
  console.log("새로운 총알 리스트", bulletList);
}

let bulletList = []; //총알들을 저장하는 리스트
let score = 0;

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = playerX + 14;
    this.y = playerY;
    this.alive = true; //true면 살아있는 총알, false면 죽은 총알
    bulletList.push(this);
  };

  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function() {
    for(let i=0; i < enemyList.length; i++){
      if (
        this.y <= enemyList[i].y && 
        this.x >= enemyList[i].x - 20 && 
        this.x <= enemyList[i].x + 20
        ) {
        //총알이 없어짐, 적군이 없어짐, 점수 획득
        this.alive = false; //죽은 총알
        console.log('checkhit alive', this.alive);
        enemyList.splice(i,1);
        score++;
      }
      if (this.y <= 0)
      {
        this.alive = false;
      }
  };
}
}
console.log('checkhit alive', this.alive);

let enemyList=[];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function() {
    this.y = 0;
    this.x = generateRandomValue(0, mainCanvas.width-48);

    enemyList.push(this);
  };
  this.update = function () {
    this.y +=  2;

    if(this.y >= mainCanvas.height - 48){
      gameOver = true;
      console.log("game over", gameOver);
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random()*(max-min+1))+min;
  return randomNum;
}

function createEnemy(){
    // const interval = setInterval(호출하고싶은함수,시간)
    const interval = setInterval(function(){
        let enemy = new Enemy();
        enemy.init();
    },1000);
};

function update() {
  // 만약에 keysDown 안에 버튼 39가 들어가 있다. 오른쪽 화살표
  if (39 in keysDown) {
    playerX += 3;
  } //right
  if (37 in keysDown) {
    playerX -= 3;
  } //left

  //플레이어의 좌표값이 무한대로 업데이트가 되는게 아닌
  //경기장 안에서만 있게 하려면
  if (playerX <= 0) {
    playerX = 0;

  }
  if (playerX >= mainCanvas.width - 58) {
    playerX = mainCanvas.width - 58;
  }

  //총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if(bulletList[i].alive){
    bulletList[i].update();
    bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  // ctx.drawImage(image, dx, dy, dWidth, dHeight)
  ctx.drawImage(backgroundImage, 0, 0, mainCanvas.width, mainCanvas.height);
  ctx.drawImage(
    playerImage,
    playerX,
    playerY,
    playerImage.width,
    playerImage.height
  );
  ctx.fillText(`Score:${score}`, 10, 20);
  ctx.fillStyle = "Aquamarine";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if(bulletList[i].alive == true){
    ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
  } 
  };

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if(!gameOver){
  update(); //좌표값을 업데이트하고
  render(); //그려주고
  //잘실행되는지 확인
  // console.log("animation calls main function");
  requestAnimationFrame(main);
  }else{
    ctx.drawImage(gameOverImage, 10, 100, 380, 500);
    document.addEventListener('click', function(){
      location.reload()
    });
  }
}
  
loadImage();
// render();
setupKeyboardListner();
main();
createEnemy();

// 방향키를 누르면
// 플레이어의 xy 좌표가 바뀌고
// 다시 render 그려준다

//플레이어가 오른쪽으로 간다 : x좌표의 값이 증가한다
//플레이어가 왼쪽으로 간다 : x좌표의 값이 감소한다

//총알만들기
//1. 총알은 스페이스바를 누르면 발사한다
//2. 총알이 발사된다. 총알이 위로 올라간다. 총알의 y좌표가 줄어든다.
//   총알의 x값은? 우주선의 x좌표와 같다.
//3. 총알이 여러개가 발사된다. 발사된 총알들은 총알 배열에 저장을 한다.
//4. 모든 총알들은 x, y좌표값이 있어야 한다.
//5. 이 총알 배열을 가지고 render 그려준다.

// 적군 만들기
// 귀엽다. x, y좌표, init, update
// 적군은 위치가 랜덤하다
// 적군은 밑으로 내려온다. y좌표가 증가한다.
// 1초마다 하나씩 적군이 나온다
// 적군이 바닥에 닿으면 게임 오버
// 적군과 총알이 만나면 적군이 사라진다 점수 1점 획득

// 적군이 죽는다
// 총알이 적군에 닿는다. 
// 총알의 y좌표가 적군의 y값보다 작아진다. 
// 총알의 x좌표가 적군의 x값보다 크고, 총알의 x좌표가 적군의 x값에서 + 적군의 넓이보다 작아진다
// 닿았다.
// 총알이 죽게됨. 적군이 없어짐. 점수획득

