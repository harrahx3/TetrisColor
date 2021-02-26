var canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    ratio = window.devicePixelRatio;

var textScore = document.querySelector('#TextScore');



var gridd = new Grid();

document.onkeydown = keyEvent;

var tile_width = 30
tile_height = 30
delta = 50;

var continu = true,
    dataSent = false;

var colors = ["blue", "red", "green", "black", "yellow"];


function intit() {
    canvas.width = windowWidth * ratio;
    canvas.height = 450 * ratio;
    canvas.style.width = windowWidth + "px";
    canvas.style.height = 450 + "px";
    context.scale(ratio, ratio);

    context.imageSmoothingEnabled = false;

    //animate();
    setInterval(update, 500);

}


function draw() {
    context.clearRect(0, 0, windowWidth, windowHeight);
    gridd.draw();

}


function update() {
    draw()
    textScore.value = gridd.score;

    gridd.fall();
    if (continu && !gridd.canFall()) {
        gridd.evaluateAndUpdate();

        continu = gridd.newBlock();
    }

    if (!continu && !dataSent) {
        dataSent = true;
        ajaxPost("DB/addGame.php", { pseudo: document.querySelector("#id_player_form").value, score: gridd.score }, function(response) {
                // Le film est affiché dans la console en cas de succès
                console.log("Les donnees " + gridd.score + " ont été envoyé au serveur : " + response);
            },
            true // Valeur du paramètre isJson
        )
    }
}


intit();