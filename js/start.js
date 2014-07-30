function startCounter(level, callback) {
    var div = document.createElement("div");
    div.style.position = "fixed";
    div.style.width = "500px";
    div.style.marginLeft = "-250px";
    div.style.marginTop = "-50px"
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.zIndex = "10";
    div.style.textAlign = "center";
    div.style.fontSize = "1.5em";
    div.innerHTML = "Level " + level;

    document.body.insertBefore(div, document.body.firstChild);
    var sec = 0;
    var intervalListener = window.setInterval(qwe, 800);

    function qwe() {
        if (sec === 4) {
            window.clearInterval(intervalListener);
        }
        sec++;
        switch (sec) {
            case 1: div.innerHTML = "Ready"; break;
            case 2: div.innerHTML = "Set"; break;
            case 3: div.innerHTML = "KILL THEM ALL"; break;
            case 4: document.body.removeChild(div);
			callback();
			break;
        }
    }
}
function IfKiledMenu(score) {
    var hidden = document.getElementsByClassName("hidden");
    for (var i = 0; i < hidden.length; i++) {
        hidden[i].style.display = "initial";
    }
    var h = document.getElementsByTagName("h2");
    h[0].innerHTML += "\nYour score is " + score;
    return 0.1; // return 0.1 to avoid enter in check is player is alive, again
}

