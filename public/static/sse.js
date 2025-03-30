/*

const eventSource = new EventSource('./sse');

eventSource.onmessage = function(event) {
    // Parse the event data as JSON
    console.log(event.data)
    var data = JSON.parse(event.data);
    document.getElementById('notificationBadge').textContent = data.length;

    // Lorsque l'utilisateur clique sur le lien de notification, afficher les notifications
        // Obtenir le conteneur de notification
      var notificationContainer = document.getElementById('notificationContainer');
    
      // Effacer les anciennes notifications
      notificationContainer.innerHTML = '';

    // Check if the data contains a notifications array
    if (Array.isArray(data)) {
        console.log('gooooo');
        // Loop through the notifications array
       data.forEach(function(notifica) {  
        var notification = notifica.data;     
        if(typeof notification === 'object'){
        if(notification.button =""){
                    notificationContainer.innerHTML +=`<div class="shadow-md box_notification">
                    <div class="notification_title">
               <h3>${notification.title}</h3>
               </div>
                    <div class="box_notif_content"> 
                    <div class="notification_body" style="">
                    <p style="font-size:0.8rem;">${notification.content}</p>
                    </div>
                    </div>
                    </div>`;
                    //notificationContainer.appendChild(notificationElement);
        }
         else{
               //alert(notification.button.length)
              let button_html='';
              for(var i=0; i<notification.button.length; i++){
                if(notification.button[i]){
                    console.log(notification.button[i]);
                button_html +=`<button class="notification_button" onclick='${notification.button[i].action}' >${notification.button[i].name}</button>`;
                }
                else{console.log('no button')}  
            }
              console.log(button_html);
               notificationContainer.innerHTML +=`
               <div class="box_notification shadow-md">
               <div class="notification_title">
               <h3>${notification.title}</h3>
               </div>
               <div class="box_notif_content">
               <div class="notification_body">
               <p style="font-size:0.8rem;">${notification.content}</p>
               </div>
               <div class="notification_button">
               ${button_html}
               </div>
               </div>
               </div>               
               `
         }           
                }       // Afficher le conteneur de notification
               else{
                console.log(notification)
               }
        });
    }
};

eventSource.onerror = function(error) {
    // hamdle the reason of the error and the error
    console.log(error)
};

*/