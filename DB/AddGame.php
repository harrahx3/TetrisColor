<?php

try
{
	// On se connecte à MySQL
	$bdd = new PDO('mysql:host=localhost;dbname=tetrisColor;charset=utf8', 'root', '', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
}
catch(Exception $e)
{
	// En cas d'erreur, on affiche un message et on arrête tout
        die('Erreur : '.$e->getMessage());
}

$data = print_r(json_decode(file_get_contents('php://input'), true), true);

if (empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);
}
else {
    $post = print_r($_POST, true);
    file_put_contents("post_form.log", $post);
}


$req = $bdd->prepare('INSERT INTO GAMES (date, time, score, id_player) VALUES(:date, :time, :score, :id_player)');

if (isset($_POST['pseudo']) && isset($_POST["score"]))
{
	$req->execute(array(
	'id_player' => $_POST['pseudo'],
	'date' => date('Y/m/d h:i:s'),
	'score' => $_POST['score'],
	'time' => '00:03:03'
	));
}
else if (isset($_POST["score"]))
{
	$req->execute(array(
	'id_player' => 2,
	'date' => date('Y/m/d h:i:s'),
	'score' => $_POST['score'],
	'time' => '00:03:03'
	));
}
$req->closeCursor();


//header("Location: /TetrisColor/TetrisColor.php")


?>

