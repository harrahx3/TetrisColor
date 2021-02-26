

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

// On récupère tout le contenu de la table jeux_video
$response = $bdd->query('SELECT * FROM games JOIN players ON id_p=id_player');

// On affiche chaque entrée une à une
while ($data = $response->fetch())
{
?>
    <p>
    <strong>Jeu</strong> : Le <?php echo $data['date']; ?><br />
    Le possesseur de ce jeu est : <?php echo $data['name']; ?>, et il a duré à <?php echo $data['time']; ?>  !<br />
    Venant de <?php echo $data['country']; ?> et a fait <?php echo $data['score']; ?> points<br />
   </p>

<?php
}

$response->closeCursor(); // Termine le traitement de la requête

?>

