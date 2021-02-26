<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Tetris Color Game</title>
    <style> canvas { background: white; }</style>
</head>

<body style="margin: 0; overflow : hidden;">

    <head>TETRIS COLOR GAME</head>
    <canvas id="canvas">
        <p>Désolé, votre navigateur ne supporte pas Canvas. Mettez-vous à jour</p>
    </canvas>
    <p>
        Historique des
        <a href="DB/viewGames.php">scores</a>
    </p>
    <form action="DB/PlayerStats.php" method="post">
        <p>
            Entrer l'id_player :
            <input id="id_player_form" type="text" name="pseudo" value="1" />
        </p>
        <p> <input type="text" name="score" value="score" id="TextScore" /> </p>
        <input type="submit" value="Valider" />
    </form>
    <p>
        blabla
    </p>
    <p>
        blabla
    </p>
    <p>
        blabla
    </p>
    <p>
        blabla
    </p>
    <p>
        blabla
    </p>
    <p>
        blabla
    </p>
    <p>
        blabla
    </p>
    <script type="text/javascript" src="JS/keyboard.js"></script>
    <script type="text/javascript" src="JS/Grid.js"></script>
    <script type="text/javascript" src="JS/TetrisColor.js"></script>
    <script type="text/javascript" src="JS/ajax.js"></script>
</body>

</html>