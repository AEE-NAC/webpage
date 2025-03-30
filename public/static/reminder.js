// Définition de la bibliothèque "reminder"
const reminder = {
    // Fonction pour ajouter un rappel
    addReminder: function(id, message, interval) {
        const reminderData = {
            id: id,
            message: message,
            interval: interval
        };
        localStorage.setItem(id, JSON.stringify(reminderData));
    },

    // Fonction pour supprimer un rappel
    removeReminder: function(id) {
        localStorage.removeItem(id);
    },

    // Fonction pour récupérer un rappel par son ID
    getReminderById: function(id) {
        const reminderData = localStorage.getItem(id);
        return JSON.parse(reminderData);
    },

    // Fonction pour afficher tous les rappels à l'utilisateur
    displayReminders: function(callback) {
        for (let i = 0; i < localStorage.length; i++) {
            const reminderData = localStorage.getItem(localStorage.key(i));
            const reminder = JSON.parse(reminderData);
            callback(reminder.id,reminder.message,reminder.interval);
        }
    },

    // Fonction pour démarrer les rappels
    startReminders: function(callback) {
        this.displayReminders(callback);
        setInterval(() => {
            this.displayReminders(callback);
        }, 1000 * 60 * 60); // Notifie l'utilisateur toutes les heures
    }
};

// Exemple d'utilisation
reminder.addReminder(1, "Rappel 1", "24 heures");
reminder.addReminder(2, "Rappel 2", "48 heures");
reminder.startReminders((reminder) => {
    console.log(reminder);
});