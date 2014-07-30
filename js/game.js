﻿(function () {
    /**
     * Game objects
     */
    var screen,
    input,
    frames,
    spFrame,
    lvFrame,

    alSprite,
    taSprite,
    ciSprite,
    expSprite,
	expSpriteBul,
    bulSprite,
    bulDownSprite,
    canvasCollisionArray,
    canvasUpSprite,
    canvasDownSprite,

    aliens,
    dir,
    player,
    bullets,
    collisions,
	collisionsBul,
    cities;
    var level = 1;
    /**
     * Initiate and start the game
     */
    function main() {
        // create game canvas and inputhandeler
        screen = new Screen(1300, 600);
        input = new InputHandeler();

        // create all sprites fram assets image
        var img = new Image();
        img.addEventListener("load", function () {

            alSprite = [
                [new Sprite(this, 0, 0, 44, 32), new Sprite(this, 0, 32, 44, 32), 
				 new Sprite(this, 0, 64, 44, 32), new Sprite(this, 0, 96, 44, 32)],
                [new Sprite(this, 44, 0, 44, 32), new Sprite(this, 44, 32, 44, 32), 
				 new Sprite(this, 44, 64, 44, 32), new Sprite(this, 44, 96, 44, 32)],
                [new Sprite(this, 88, 0, 44, 32), new Sprite(this, 88, 32, 44, 32), 
				 new Sprite(this, 88, 64, 44, 32), new Sprite(this, 88, 96, 44, 32)],
				[new Sprite(this, 0, 191, 44, 32), new Sprite(this, 0, 223, 44, 32), 
				 new Sprite(this, 0, 255, 44, 32), new Sprite(this, 0, 287, 44, 32)],
				[new Sprite(this, 44, 191, 44, 32), new Sprite(this, 44, 223, 44, 32), 
				 new Sprite(this, 44, 255, 44, 32), new Sprite(this, 44, 287, 44, 32)],
				[new Sprite(this, 88, 191, 44, 32), new Sprite(this, 88, 223, 44, 32), 
				 new Sprite(this, 88, 255, 44, 32), new Sprite(this, 88, 287, 44, 32)],
				[new Sprite(this, 132, 191, 44, 32), new Sprite(this, 132, 223, 44, 32), 
				 new Sprite(this, 132, 255, 44, 32), new Sprite(this, 132, 287, 44, 32)],
				[new Sprite(this, 0, 319, 44, 32), new Sprite(this, 0, 351, 44, 32), //dsa
				 new Sprite(this, 0, 383, 44, 32), new Sprite(this, 0, 415, 44, 32)],
				[new Sprite(this, 44, 319, 44, 32), new Sprite(this, 44, 351, 44, 32), 
				 new Sprite(this, 44, 383, 44, 32), new Sprite(this, 44, 415, 44, 32)],
				[new Sprite(this, 88, 319, 44, 32), new Sprite(this, 88, 351, 44, 32), 
				 new Sprite(this, 88, 383, 44, 32), new Sprite(this, 88, 415, 44, 32)],
				[new Sprite(this, 132, 319, 44, 32), new Sprite(this, 132, 351, 44, 32), 
				 new Sprite(this, 132, 383, 44, 32), new Sprite(this, 132, 415, 44, 32)]
            ];
            taSprite = new Sprite(this, 126, 0, 91, 70);
            ciSprite = new Sprite(this, 84, 8, 36, 24);
            bulSprite = new Sprite(this, 216, 0, 16, 16);
            bulDownSprite = new Sprite(this, 232, 0, 16, 16);
            canvasUpSprite = new Sprite(this, 216, 16, 43, 24);
            canvasDownSprite = new Sprite(this, 216, 42, 43, 24);
            expSprite = [new Sprite(this,0,128,31,32),new Sprite(this,31,128,31,32),new Sprite(this,62,128,31,32),
                new Sprite(this,93,128,31,32),new Sprite(this,124,128,31,32),new Sprite(this,155,128,31,32),
                new Sprite(this,186,128,31,32),new Sprite(this,217,128,31,32),
                new Sprite(this,279,128,31,32),new Sprite(this,310,128,31,32),new Sprite(this,341,128,31,32)
            ];
			expSpriteBul = [
                new Sprite(this,0,160,31,32),new Sprite(this,31,160,31,32),new Sprite(this,62,160,31,32),
                new Sprite(this,93,160,31,32),new Sprite(this,124,160,31,32),
                new Sprite(this,155,160,31,32),new Sprite(this,186,160,31,32),new Sprite(this,217,160,31,32)
            ];

            // initate and run the game
            init();
            run();
        });
		playMusic();
        img.src = "res/invaders8.png";
    };

    /**
     * Initate game objects
     */
    function init() {
        // set start settings
        frames = 0;
        spFrame = 0;
        lvFrame = 60;

        dir = 1;

        // create the player object
        player = {
            score:0,
            lifes:100,
            sprite: taSprite,
            x: (screen.width - taSprite.w) / 2,
            y: screen.height - (30 + taSprite.h),
			w: taSprite.w,
			h: taSprite.h
        };

        // initatie bullet array
        bullets = [];
        collisions = [];
		collisionsBul = [];
        canvasCollisionArray= [];

        // create and populate alien array
        aliens = [];
        var rows = [1, 0, 0, 2, 2];
        for (var i = 0, len = rows.length; i < len; i++) {
            for (var j = 0; j < 10; j++) {
                var a = rows[i];
                // create right offseted alien and push to alien
                // array
                aliens.push({
                    sprite: alSprite[a],
                    x: 50 + j * 50 + [0, 4, 0][a],
                    y: 40 + i * 40,
                    w: alSprite[a][0].w,
                    h: alSprite[a][0].h
                });
            }
        }
    };

    /**
     * Wrapper around the game loop function, updates and renders
     * the game
     */
    function run() {
        var loop = function () {
            update();
            render();

            window.requestAnimationFrame(loop, screen.canvas);
        };
        window.requestAnimationFrame(loop, screen.canvas);
    };

    /**
     * Update the game logic
     */
    function update() {
        // update the frame count
        frames++;

        // update player position depending on pressed keys
        if (input.isDown(37) && player.lifes > 0) { // Left
            player.x -= 4;
        }
        if (input.isDown(39) && player.lifes > 0) { // Right
            player.x += 4;
        }
        // keep the player sprite inside of the canvas
        player.x = Math.max(Math.min(player.x, screen.width - (30 + taSprite.w)), 30);

        // append new bullet to the bullet array if spacebar is
        // pressed
        if (input.isPressed(32) && player.lifes > 0) { // Space
		
			 //fix bug when, stop music and press "space"
            if (document.activeElement === document.getElementById("musicCheck") ||
                document.activeElement === document.getElementById("soundsCheck")) {

                document.getElementById("musicCheck").blur();
                document.getElementById("soundsCheck").blur();
            }
		
            bullets.push(new Bullet(player.x + 45.5, player.y, -8, 2, 6, "#fff",'up'));
			var shootSfx = document.getElementById("shoot");
			var soundcheck = document.getElementById("soundsCheck");
			if(soundcheck.checked == 1) {
				shootSfx.play();
				shootSfx.currentTime=0;
			}
        }

        // update all bullets position and checks
        for (var i = 0, len = bullets.length; i < len; i++) {
            var b = bullets[i];
            b.update();
            // remove bullets outside of the canvas
            if (b.y + b.height < 0 || b.y > screen.height) {
                canvasCollisionArray.push(new canvasCollision(b.x, b.y, b.direction));
                bullets.splice(i, 1);
                i--;
                len--;
                continue;
            }
			
			
			//check if bullet hit the player
			if (PPBBIntersect(player.x, player.y, player.w, player.h, b.x, b.y, b.width, b.height)) {
				var soundcheck = document.getElementById("soundsCheck");
				if(soundcheck.checked) {
					var hit = document.getElementById("hit");
					hit.play();
					hit.currentTime = 0;
				}
				player.lifes -=10;
				bullets.splice(i, 1);
				i--;
				len--;
			}
			
			//cheack if player still have live
            if (player.lifes <= 0) {
                player.y = 1300;
                player.lifes = IfKiledMenu(player.score);
				var soundcheck = document.getElementById("soundsCheck");
				if(soundcheck.checked == 1) {
					var gameOver = document.getElementById("gameOver");
					gameOver.play();
					gameOver.currentTime = 0;
				}
            }

            // check if bullet hit any aliens
            for (var j = 0, len2 = aliens.length; j < len2; j++) {
                var a = aliens[j];
                if (b.direction === 'up' && AABBIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)) {
					var soundcheck = document.getElementById("soundsCheck");
					if(soundcheck.checked == 1) {
						var explosion = document.getElementById("boom");
						explosion.play();
						explosion.currentTime = 0;
					}
                    collisions.push(new Collision(a.x, a.y));
                    player.score += 1;
                    aliens.splice(j, 1);
                    j--;
                    len2--;
                    bullets.splice(i, 1);
                    i--;
                    len--;
                    // increase the movement frequence of the aliens
                    // when there are less of them
                    switch (len2) {
                        case 30: {
                            this.lvFrame = 40;
                            break;
                        }
                        case 10: {
                            this.lvFrame = 20;
                            break;
                        }
                        case 5: {
                            this.lvFrame = 15;
                            break;
                        }
                        case 1: {
                            this.lvFrame = 6;
                            break;
                        }
						case 0: {
                            //end of level and start new one
                            level++;
							var soundcheck = document.getElementById("soundsCheck");
							if(soundcheck.checked) {
								var levelUp = document.getElementById("levelUp");
								levelUp.play();
								levelUp.currentTime = 0;
							}
                            //statCounter is callback function waits the code in its body to finish and than execute another function
                            startCounter(level, function () {
                                //levels
                                switch (level) {
                                    case 2: rows = [7, 8, 9, 9, 10]; break;
                                    case 3: rows = [3, 4, 5, 5, 6]; break;
                                    case 4: rows = [2, 2, 2, 2, 2]; break;
                                    case 5: rows = [2, 0, 2, 0, 2]; break;
                                    case 6: rows = [1, 2, 0, 2, 1]; break;
                                    case 7: rows = [0, 1, 2, 1, 0]; break;
                                    case 8: rows = [2, 0, 0, 0, 2]; break;
                                    case 9: rows = [1, 2, 0, 2, 2]; break;
                                    default: rows = [getRandomInt(0, 2), getRandomInt(0, 2), getRandomInt(0, 2), getRandomInt(0, 2), getRandomInt(0, 2)]; break;
                                }

                                aliens = [];
								debugger;
                                for (var i = 0, len = rows.length; i < len; i++) {
                                    for (var j = 0; j < 10; j++) {
                                        var a = rows[i];
                                        // create right offseted alien and push to alien
                                        // array
                                        aliens.push({
                                            sprite: alSprite[a],
                                            x: 50 + j * 50 ,
                                            y: 40 + i * 40,
                                            w: alSprite[a][0].w,
                                            h: alSprite[a][0].h
                                        });
                                    }
                                }
                                render();

                            });
                            break;
                        }
                    }
                }
            }
			for (var j = 0; j < len; j++) {
				var bul = bullets[j];
				//console.log('inside');
				
				if (bul.direction !== b.direction){
				
					if (BBBBIntersect(bul.x, bul.y, bul.width, bul.height, b.x, b.y, b.width, b.height)) {
					collisionsBul.push(new Collision(bul.x, bul.y));
						bullets.splice(i, 1);
						bullets.splice(j, 1);
						i--;
						len-=2;
						j--;
						var soundcheck = document.getElementById("soundsCheck");
						if(soundcheck.checked) {
							var ricochet = document.getElementById("ricochet");
							ricochet.play();
							ricochet.currentTime = 0;
						}
						break;
						
					}
				}
			}
        }
        // makes the alien shoot in an random fashion
        if (Math.random() < 0.03 && aliens.length > 0) {
            var a = aliens[Math.round(Math.random() * (aliens.length - 1))];
            // iterate through aliens and check collision to make
            // sure only shoot from front line
            for (var i = 0, len = aliens.length; i < len; i++) {
                var b = aliens[i];

                if (AABBIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)) {
                    a = b;
                }
            }
            // create and append new bullet
            bullets.push(new Bullet(a.x + a.w * 0.5, a.y + a.h, 4, 2, 4, "#fff",'down'));
        }
        // update the aliens at the current movement frequence
        if (frames % lvFrame === 0) {
            spFrame = (spFrame + 1) % 4;

            var _max = 0, _min = screen.width;
            // iterate through aliens and update postition
            for (var i = 0, len = aliens.length; i < len; i++) {
                var a = aliens[i];
                a.x += 30 * dir;
                // find min/max values of all aliens for direction
                // change test
                _max = Math.max(_max, a.x + a.w);
                _min = Math.min(_min, a.x);
            }
            // check if aliens should move down and change direction
            if (_max > screen.width - 30 || _min < 30) {
                // mirror direction and update position
                dir *= -1;
                for (var i = 0, len = aliens.length; i < len; i++) {
                    aliens[i].x += 30 * dir;
                    aliens[i].y += 30;
                }
            }
        }
    };

    /**
     * Render the game state to the canvas
     */
    function render() {
        screen.clear(); // clear the game canvas
        // draw all aliens
        for (var i = 0, len = aliens.length; i < len; i++) {
            var a = aliens[i];
            screen.drawSprite(a.sprite[spFrame], a.x, a.y);
        }
        // save contetx and draw bullet then restore
        screen.ctx.save();
        for (var i = 0, len = bullets.length; i < len; i++) {
            if(bullets[i].direction == 'up'){
                screen.drawSprite(bulSprite, bullets[i].x, bullets[i].y);
            }
            else{
                screen.drawSprite(bulDownSprite, bullets[i].x, bullets[i].y);
            }
        }
        screen.ctx.restore();
		//drawnPlayerScore
        screen.ctx.save();
        screen.drawScore(player.score, screen.width-100, screen.height-50);
        screen.ctx.restore();
		
		//drawnPlayerLifes
		screen.ctx.save();
        screen.drawLifes(player.lifes.toFixed(0), screen.width-150, screen.height-50);
        screen.ctx.restore();

        // draw the player sprite
        screen.drawSprite(player.sprite, player.x, player.y);

        //drawing explosions
        screen.ctx.save();
        for (var i = 0; i <collisions .length; i++) {
            for (var j = 0; j < expSprite.length; j++) {
                screen.ctx.save();
                screen.drawSprite(expSprite[j], collisions[i].x, collisions[i].y);
                screen.ctx.restore();
            }
        }

		for (var i = 0; i <collisionsBul.length; i++) {
            for (var j = 0; j < expSpriteBul.length; j++) {
                screen.ctx.save();
                screen.drawSprite(expSpriteBul[j], collisionsBul[i].x, collisionsBul[i].y);
                screen.ctx.restore();
            }
        }

        //drawing explosions on interaction with the canvas
        screen.ctx.save();
        for (var i = 0; i < canvasCollisionArray.length; i++) {
            if(canvasCollisionArray[i].direction == 'up'){
                screen.drawSprite(canvasUpSprite, canvasCollisionArray[i].x, canvasCollisionArray[i].y+5);
            }
        }
        screen.ctx.restore();
        collisions = [];
		collisionsBul = [];
        canvasCollisionArray = [];
    };
	
	/**
	 * Play background music
	 */
	function playMusic() {
		var music = document.getElementById("backgroundMusic");
		var musicCheck = document.getElementById("musicCheck");
		if(musicCheck.checked) {
				music.play();
		}
		musicCheck.onchange=function(){
			if(musicCheck.checked) {
				music.play();
			}
			else {
				music.pause();
				music.currentTime=0;
			}
		};
	}

    // start and run the game
	window.setTimeout(main, 3 * 800);
    window.cleartimeout();
    main();
}());