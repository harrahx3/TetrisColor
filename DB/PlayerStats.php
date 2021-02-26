

<?php
try
{
	// On se connecte à MySQL
	$bdd = new PDO('mysql:host=localhost;dbname=TetrisColor;charset=utf8', 'root', '', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
}
catch(Exception $e)
{
	// En cas d'erreur, on affiche un message et on arrête tout
        die('Erreur : '.$e->getMessage());
}

// Si tout va bien, on peut continuer

// On récupère tout le classement du joueur
//$response = $bdd->query('SELECT COUNT(DISTINCT id_player) AS rank FROM games WHERE score >= (SELECT MAX(score) FROM games JOIN players ON id_player=id_p WHERE name="a player1")');

$req = $bdd->prepare('SELECT COUNT(DISTINCT id_player) AS rank FROM games WHERE score >= (SELECT MAX(score) FROM games JOIN players ON id_player=:id_p WHERE name="a player1")');
//$req = $bdd->prepare('SELECT id_player AS rank FROM games WHERE id_player=:id_p');

if (isset($_POST['pseudo']))
{
	$req->execute(array(
	'id_p' => $_POST['pseudo']
	));
}

// On affiche chaque entrée une à une
while ($data = $req->fetch())
{
?>
    <p>
    <strong>Joueur</strong> : Votre classement :  <?php echo $data['rank']; ?><br />

   </p>

<?php
}

$req->closeCursor(); // Termine le traitement de la requête

?>

