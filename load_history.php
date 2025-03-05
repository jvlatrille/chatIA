<?php
session_start(); // Démarre la session PHP

// Vérifie si l'historique des messages existe dans la session
if (isset($_SESSION['chat_history'])) {
    echo json_encode($_SESSION['chat_history']); // Renvoie l'historique en JSON
} else {
    echo json_encode([]); // Renvoie un tableau vide si aucun historique
}
?>
