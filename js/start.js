function startCounter(level, callback) {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "500px";
    div.style.top = "45%";
    div.style.left = "38%";
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

