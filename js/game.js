(function () {
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

    aliens,
    dir,
    player,
    bullets,
    cities;

    /**
     * Initiate and start the game
     */
    function main() {
        // create game canvas and inputhandeler
        screen = new Screen(1000, 600);
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
				 new Sprite(this, 88, 64, 44, 32), new Sprite(this, 88, 96, 44, 32)]
            ];
            taSprite = new Sprite(this, 126, 0, 91, 70);
            ciSprite = new Sprite(this, 84, 8, 36, 24);

            // initate and run the game
            init();
            run();
        });
		playMusic();
        img.src = "res/invaders3.png";
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
            sprite: taSprite,
            x: (screen.width - taSprite.w) / 2,
            y: screen.height - (30 + taSprite.h)
        };

        // initatie bullet array
        bullets = [];


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
        if (input.isDown(37)) { // Left
            player.x -= 4;
        }
        if (input.isDown(39)) { // Right
            player.x += 4;
        }
        // keep the player sprite inside of the canvas
        player.x = Math.max(Math.min(player.x, screen.width - (30 + taSprite.w)), 30);

        // append new bullet to the bullet array if spacebar is
        // pressed
        if (input.isPressed(32)) { // Space
            bullets.push(new Bullet(player.x + 45.5, player.y, -8, 2, 6, "#fff"));
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
                bullets.splice(i, 1);
                i--;
                len--;
                continue;
            }

            // check if bullet hit any aliens
            for (var j = 0, len2 = aliens.length; j < len2; j++) {
                var a = aliens[j];
                if (AABBIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)) {
					var soundcheck = document.getElementById("soundsCheck");
					if(soundcheck.checked == 1) {
						var explosion = document.getElementById("boom");
						boom.play();
						boom.currentTime=0;
					}
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
            bullets.push(new Bullet(a.x + a.w * 0.5, a.y + a.h, 4, 2, 4, "#fff"));
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
            screen.drawBullet(bullets[i]);
        }
        screen.ctx.restore();

        // draw the tank sprite
        screen.drawSprite(player.sprite, player.x, player.y);
    };
	
	/**
	 * Play background music
	 */
	function playMusic() {
		var music = document.getElementById("backgroundMusic");
		var musicCheck = document.getElementById("musicCheck");
		music.play();
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
    main();
}());