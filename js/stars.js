(function () {
    var speed = [];
    var starCount = 50;
    var stars = [];
    var height;
    var width;
    var x = [];
    var y = [];

    function createStars() {


        var div = document.createElement("div");
        div.style.color = "white";
        div.style.position = "absolute";
        div.style.top = 0;
        div.style.left = 0;
        div.style.width = "1px";
        div.style.height = "1px";
        div.style.overflow = "visible";
        div.style.backgroundColor = "transparent";



        document.body.insertBefore(div, document.body.firstChild);

        for (var i = 0; i < starCount; i++) {
            stars[i] = document.createElement("div");
            stars[i].style.color = "white";
            stars[i].style.backgroundColor = "transparent";
            stars[i].style.position = "absolute";
            stars[i].appendChild(document.createTextNode("."));
            stars[i].style.font = "15px monospace";
            speed[i] = getRandomInt(3, 10);
            x[i] = getRandomInt(-1300, 1300);
            y[i] = getRandomInt(-500, -100);
            stars[i].style.top = y[i];
            stars[i].style.left = x[i];
            div.appendChild(stars[i]);
        }
        setInterval(move, 30);
    }

    function move() {

        height = screen.height;
        width = screen.width;



        for (var i = 0; i < starCount ; i++) {
            x[i] += speed[i];
            y[i] += speed[i];

            if ((y[i]) > (height-150) || (x[i] > width-50)) {

                stars[i].style.top = y[i] + "px";
                stars[i].style.left = x[i] + "px";
                x[i] = getRandomInt(-1300, 1300);
                y[i] = getRandomInt(-500, -100);
            }
            stars[i].style.top = y[i] + "px";
            stars[i].style.left = x[i] + "px";

        }
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    createStars();
}());