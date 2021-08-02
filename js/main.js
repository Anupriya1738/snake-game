
const movesound = new Audio('bend.wav');
const gameoversound = new Audio('gameover1.wav');
const foodsound = new Audio('eat.wav');
const musicsound = new Audio('bgmusic.mp3');
let inputdir = { x: 0, y: 0 };
// this array will contain the snake in form of positions
let snakearray = [
    { x: 20, y: 14 },
]
let food = { x: Math.round(2 + (24 - 2) * Math.random()), y: Math.round(2 + (16 - 2) * Math.random()) }
let lastpaint = 0;

let speed = 5;

let gamestart = 0; // a flag to check if game started
let score = 0;
let pressedkey = "nokey";
// game loop
function main(ctime) {
    // best way to execute game loop
    window.requestAnimationFrame(main);
    if ((ctime - lastpaint) / 1000 < 1 / speed) {
        return;
    }
    console.log('a');
    lastpaint = ctime;
    startgame();

}


function iscollision() {

    //if collision happens with the wall
    if (snakearray[0].x < 0 || snakearray[0].y < 0 || snakearray[0].x > 26 || snakearray[0].y > 18)
        return true;

    //if collision happens with the snake body
    for (let i = 1; i < snakearray.length; i++) {

        if (snakearray[0].x === snakearray[i].x && snakearray[0].y === snakearray[i].y)
            return true;

    }

}

// to rotate head of snake according to the pressed key
function imgrotate(element){
    // console.log('in');
    // console.log(pressedkey+'in');
    // console.log(element);
    if(pressedkey === "ArrowLeft"){
        console.log(element);
        element.style.transform = "rotate(-90deg)";
        return;
    }
    if(pressedkey === "ArrowRight"){
        console.log(element);
        element.style.transform = "rotate(90deg)";
        return;
    }
    if(pressedkey === "ArrowUp"){
        console.log(element);
        element.style.transform = "rotate(0deg)";
        return;
    }
    if(pressedkey === "ArrowDown"){
        console.log(element);
        element.style.transform = "rotate(180deg)";
        return;
    }

}
function randomgenerate(){
    
    let a = 2;
    let b = 24;
    let c = 2;
    let d = 16
    food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(c + (d - c) * Math.random()) }
    snakearray.forEach(function(e){
        if(e.x === food.x && e.y === food.y){
            food = randomgenerate();
            
        }

    });
    return food;
}

let board = document.getElementById('mainboard');
//main engine of game
function startgame() {
    musicsound.play();
    //1) update items

    // moving the snake
    // musicsound.play();
    for (let i = snakearray.length - 2; i >= 0; i--) {
        console.log('b');
        snakearray[i + 1] = { ...snakearray[i] }; // we made it a new object

    }
    snakearray[0].x += inputdir.x;
    snakearray[0].y += inputdir.y;

    //if collision happens
    if (iscollision()) {
        gameoversound.play();
        musicsound.pause();
        alert("Game Over. Press Ok to play again!");
        // after someone press okay from alert box
        inputdir = { x: 0, y: 0 };
        snakearray = [
            { x: 20, y: 14 },
        ]
        gamestart = 0;
        score = 0;
        gameoversound.pause();

    }

    // if snake eats a food
    if (snakearray[0].x === food.x && snakearray[0].y === food.y) {
        // unshift adds an element to the begibning of an array and return new length of the array
        foodsound.play();
        snakearray.unshift({ x: snakearray[0].x + inputdir.x, y: snakearray[0].y + inputdir.y });
        
        food = randomgenerate();
        
        score += 1;
        if( (score%4)  == 0)
            speed+=2;
        scorebox.innerHTML = "Score: " + score;

        if(score > hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
    }





    // 2) display items
    // wer are grabbing the board

    // since we don't want to add a snake if a snake is already present in the board
  
     //display the snake
     
    board.innerHTML = "";
   
    snakearray.forEach(function (e, index) {
        // we will create an element called snake
        snake = document.createElement('div');
        snake.style.gridRowStart = e.y;
        snake.style.gridColumnStart = e.x;
        console.log('out');
      
        
        if (index == 0) {//adding head of snake
            snake.className = "head";
            imgrotate(snake);
        }

        else { // adding body of snake
            snake.className = "snake";
        }

        board.appendChild(snake);
    });

    //display the food
  
        snakefood = document.createElement('div');
        snakefood.style.gridRowStart = food.y;
        snakefood.style.gridColumnStart = food.x;
        snakefood.className = "food";
        
        board.appendChild(snakefood);
   
    //display the score
    
    scorebox.innerHTML = "Score: " + score;
}

// get highscore from local storage
let scorebox = document.getElementById('scoreBox');
let hiscoreBox = document.getElementById('hiscoreBox');
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

// now we have added snake and food on the board so it's time to start the game
// so main logic starts here
// when someone presses any key than listener is fired and game starts

function isvalidkey(element){
    
    if(element === "ArrowUp" && pressedkey === "ArrowDown"){
        return false;
    } 
    if(element === "ArrowDown" && pressedkey === "ArrowUp"){
        return false;
    } 
    if(element === "ArrowLeft" && pressedkey === "ArrowRight"){
        return false;
    } 
    if(element === "ArrowRight" && pressedkey === "ArrowLeft"){
        return false;

    }
    return true;
}

window.addEventListener('keydown', function (e) {
    movesound.play();
    if (gamestart == 0) {
        inputdir = { x: 0, y: -1 };
        gamestart = 1;
    }

    if (isvalidkey(e.key)) {
        switch (e.key) {
            case "ArrowUp":
                console.log("ArrowUp");
                pressedkey = "ArrowUp";
                inputdir.x = 0;
                inputdir.y = -1;
                break;

            case "ArrowDown":
                console.log("ArrowDown");
                pressedkey = "ArrowDown";
                inputdir.x = 0;
                inputdir.y = 1;
                break;

            case "ArrowLeft":
                console.log("ArrowLeft");
                pressedkey = "ArrowLeft";
                inputdir.x = -1;
                inputdir.y = 0;
                break;

            case "ArrowRight":
                console.log("ArrowRight");
                pressedkey = "ArrowRight";
                inputdir.x = 1;
                inputdir.y = 0;
                break;

            default:
                console.log("otherkey");
        }
    }

})





// best way to execute game loop
window.requestAnimationFrame(main);