document.addEventListener("DOMContentLoaded", function () {
    let converter = new showdown.Converter();
    const chatBox = document.getElementById('chat-box');

    // Fonction pour afficher un message dans la zone de chat
    function displayMessage(content, className) {
        const message = document.createElement('div');
        message.classList.add('message', className);
        message.innerHTML = content;
        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight; // Fait défiler vers le bas
    }

    // Charger l'historique des messages
    fetch('load_history.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(entry => {
                // Affiche le message utilisateur
                displayMessage(entry.user, 'user-message');
                // Convertit et affiche la réponse de l'IA en Markdown
                const markdownContent = converter.makeHtml(entry.ia);
                displayMessage(markdownContent, 'ia-message');
            });
        })
        .catch(error => console.error('Erreur lors du chargement de l\'historique :', error));

    // Fonction pour envoyer un message
    function sendMessage() {
        const userInput = document.getElementById('user-input').value.trim();
        if (userInput === '') return;

        // Affiche le message utilisateur
        displayMessage(userInput, 'user-message');

        // Désactive l'entrée utilisateur
        document.getElementById('user-input').value = '';
        document.getElementById('user-input').disabled = true;
        document.getElementById('send-button').disabled = true;

        // Affiche l'animation de saisie de l'IA
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.style.visibility = 'visible';

        // Envoie le message au serveur
        fetch('server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'message=' + encodeURIComponent(userInput),
        })
        .then(response => response.json())
        .then(data => {
            // Masque l'animation
            typingIndicator.style.visibility = 'hidden';

            // Convertit et affiche la réponse de l'IA en Markdown
            const markdownContent = converter.makeHtml(data.response);
            displayMessage(markdownContent, 'ia-message');

            // Réactive l'entrée utilisateur
            document.getElementById('user-input').disabled = false;
            document.getElementById('send-button').disabled = false;
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi du message :', error);
            typingIndicator.style.visibility = 'hidden';
            document.getElementById('user-input').disabled = false;
            document.getElementById('send-button').disabled = false;
        });
    }

    // Gère l'appui sur la touche "Entrée" pour envoyer le message
    function handleKeyPress(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    // Assigne les fonctions aux éléments
    window.sendMessage = sendMessage;
    window.handleKeyPress = handleKeyPress;
});
