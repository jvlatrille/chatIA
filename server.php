<?php
session_start(); // Démarre la session PHP

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userMessage = $_POST['message'];

    // Vérifie si l'historique des messages existe dans la session
    if (!isset($_SESSION['chat_history'])) {
        $_SESSION['chat_history'] = []; // Initialise l'historique si inexistant
    }

    // Envoi de la requête à Ollama avec Llama 3.2
    $command = escapeshellcmd("ollama run llama3.2 \"$userMessage\"");
    $output = shell_exec($command);

    // Ajoute le message utilisateur et la réponse de l'IA à l'historique
    $_SESSION['chat_history'][] = ['user' => $userMessage, 'ia' => $output];

    // Envoi de la réponse au client
    echo json_encode(['response' => $output]);
}
?>
