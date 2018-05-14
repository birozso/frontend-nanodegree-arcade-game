const modal = document.getElementById('endModal');
const help = document.getElementById('modalHelp');
const message = document.getElementById('modalMessage');
const playBtn = document.getElementById('playBtn');
const closeBtn = document.getElementById('closeBtn');
const modalWin = document.getElementById('modalHeaderWon');
const modalLost = document.getElementById('modalHeaderLost');
const myPara = document.getElementById('h3Message');


// Enemies our player must avoid
var Enemy = function(name, speed , row, pos) {
    this.speed = speed;
    this.name = name;
    this.y = row;
    this.x = pos;

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    if (Math.round(this.x) === player.x && this.y === player.y) {
        checkCollisions();
    }

    this.x += dt * this.speed;
    if (this.x > 3.9 ) {
        this.x = -0.2;
        this.y = rand(4);
    }


    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),   101 * this.x , this.y * 83);
    if (player.level > 0 && player.level < 3) {
        this.speed = 1.2;
    }
    if (player.level > 2 ) {
        this.speed = 1.4;

    }
};


function Player (name, x , y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.lives = 5;
    this.win = 0;
    this.level = 0;
    this.collision = function() {
        this.lives -= 1;
    };

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), (this.x) * 101, (this.y) * 83);
};

/*
 * Remove a life portion from player  and check if all lives lost
 */
function checkCollisions() {
       player.collision();
       myPara.textContent = 'Life Lost! ';
       messageDisplay();
       player.x = 2;
       player.y = 5;

    if (player.lives === 0) {
        modalLost.style.display = 'block';
        modalWin.style.display = 'none';
        modalOpen();
    }
}

/*
 * modify the modalMessage content and display and hide it
 */
function messageDisplay() {

    message.style.display = 'block';
    setTimeout( function() {
            message.style.display = 'none';
    }, 1000);

}

player = new Player ('changable-character', 2 , 5);
/* max number of x (colomns) is 4 ( from 0 to 4)
 * max number of y (rows) is 5 ( from 0 to 5). Set 2 and 5 , center bottom position as default
 */

player.sprite = 'images/char-princess-girl.png';

let select = 0;
let num =0;

/*
 * handle the keypress by logic. Move the character , change it , help, reset functions
 */
player.handleInput = function(movement) {

    if (movement === 'up' && this.y > 0) {
        this.y -= 1;
    }
    else if (movement === 'down' && this.y < 5) {
        this.y += 1;
    }
    else if (movement === 'right' && this.x < 4) {
        this.x += 1;
    }
    else if (movement === 'left' && this.x > 0) {
        this.x -= 1;
    }
    else if (movement === 'player' && select === 0) {
        select += 1;
        this.sprite = 'images/char-pink-girl.png';
    }
    else if (movement === 'player' && select === 1) {
        this.sprite = 'images/char-boy.png';
        select += 1;
    }
    else if (movement === 'player' && select === 2) {
        this.sprite = 'images/char-cat-girl.png';
        select += 1;
    }
    else if (movement === 'player' && select === 3) {
        this.sprite = 'images/char-horn-girl.png';
        select += 1;
    }
    else if (movement === 'player' && select === 4) {
        this.sprite = 'images/char-princess-girl.png';
        select = 0;
    }
    else if (movement === 'reset') {
        window.location.reload();
    }
    else if (movement === 'enemy') {
        allEnemies.forEach(enemyz => {
            if (enemyz.sprite === 'images/enemy-bug.png') {
                enemyz.sprite = 'images/enemy-frog.png';
            }
            else if (enemyz.sprite === 'images/enemy-frog.png')  {
                enemyz.sprite = 'images/enemy-bug.png'; 
            }

        });;
    }

    else if (movement === 'help') {
        num += 1;
        if (num % 2 === 0 ){
            help.style.display = 'block';
        }
        else if (num % 2 !=0 ){
            help.style.display = 'none';
        }

    }

    /* 
     * move the frog next to the princess in the finish area
     */
    if (this.y >= 0 && this.y < 3 && this.x > 0) {
        frog.y = 0;
        frog.x = this.x - 1;
        frog.left = false;
        frog.change();
        this.update();
    }
    else if (this.y === 0 && this.x === 0) {
        frog.y = 0;
        frog.x = this.x + 1;
        frog.left = true;
        frog.change();
        this.update();
    }

    if (this.y === 0) {
        this.level += 1;
        myPara.textContent = 'Level up! ';
        messageDisplay();
        this.win += 1;
        if (this.win ===2){
            allEnemies.push(enemyRb);
        }
        else if (this.win > 4) {
            modalWin.style.display = 'block';
            modalLost.style.display = 'none';
            modalOpen();
        }

        /*
         *  little delay in place  the player back to start position
         */
        setTimeout( function() {
        player.x=2;
        player.y=5;
        }, 50);
    }

};

/*
 * check if player found a life or not
 */
player.checkPosition = function() {
    if (this.x === heart.x && this.y === heart.y) {
        heart.x = 6; heart.y = 6;
        this.lives +=1;
        myPara.textContent = 'Extra Life! ';
        messageDisplay();
        heart.remove();
    }

};

Player.prototype.update = function(dt) {
    player.checkPosition();
};

/*
 * a frog created , as a reward for the little princess. it has created by 
 * Player const. as it is not enemy
 */
frog = new Player ('love-frog', 5 , 6);
frog.sprite = 'images/love-frog-right.png';
frog.left = false;
frog.change = function() {
    if (frog.left === true) {
        this.sprite = 'images/love-frog.png';
    }
    else {
        this.sprite = 'images/love-frog-right.png';
    }
};

heart = new Player ('extra-life', rand(4), rand(4) )
heart.sprite = 'images/heart.png';
heart.remove = function() {
    let removed = allEnemies.splice(0, 1);
};

/*
 * Random number generator , needed to place enemies to random position
 */
function rand(numero) {
	return Math.floor(Math.random() * numero) + 1;
}

enemyS4 = new Enemy ('bugSlow4', 0.69, 4, 0);
enemyS2 = new Enemy ('bugSlow2', 0.62, 2, -0.2);
enemyS3 = new Enemy ('bugSlow3', 0.64, 3, 0);
enemyF2 = new Enemy ('bugFast2', 1.05, 2, -0.2);
enemyF1 = new Enemy ('bugFast1', 1, 1, -0.2);
enemyRa = new Enemy ('bugRandoma', 0.62, rand(2), Math.random());
enemyRb = new Enemy ('bugRandomb', 1.5, rand(4), -Math.random());
enemyRb.sprite = 'images/enemy-frog.png';
enemyRc = new Enemy ('bugRandomc', 0.63, rand(3), -0.2);
enemyRd = new Enemy ('bugRandomd', 1, rand(4), -0.2);
enemyRe = new Enemy ('bugRandome', 1.05, rand(3), -Math.random());

let allEnemies = [heart, enemyS3, enemyS4, enemyS2, enemyF2, enemyF1, enemyRa, enemyRc, enemyRd, enemyRe, frog];

/* This listens for key presses and sends the keys to your
 * Player.handleInput() method. Extended with player and enemy change function , help menu and reset input.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        72: 'help',
        80: 'player',
        69: 'enemy',
        82: 'reset'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*
 * these last lines for modal handling functions : display, hide , button handling
 */ 

function modalOpen() {
    modal.style.display = 'block';
}

function modalClose() {
    modal.style.display = 'none';
}

function allClose() {
    modalClose();
    close();
}

closeBtn.addEventListener('click', allClose);
playBtn.addEventListener('click', function closeReset() {
    modalClose();
    window.location.reload();
});
