/*

self.addEventListener("push", (event) => {
    let data=event.data.json()

    const options = {
        title: data.notification.title,
        body: data.notification.body,
        icon: data.notification.icon,
        vibrate: data.notification.vibration,
        icon: data.notification.image ||'assets/img/logo.png',
        
    }
    self.registration.showNotification(data.notification.title,options)
})
*/

importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js')


const firebaseConfig = {
    apiKey: "AIzaSyDThIeE6cy5zQV215KKKlhkMpc4fodQ8jc",
    authDomain: "fby-security-app.firebaseapp.com",
    projectId: "fby-security-app",
    storageBucket: "fby-security-app.appspot.com",
    messagingSenderId: "564174614939",
    appId: "1:564174614939:web:778414c6ac9ce646fe713e",
    measurementId: "G-J42S026FXR"
  };
  firebase.initializeApp(firebaseConfig)
  
  const messaging=firebase.messaging()


  console.log(messaging)
            
messaging.setBackgroundMessageHandler(function(payload){
    console.log(payload)
})