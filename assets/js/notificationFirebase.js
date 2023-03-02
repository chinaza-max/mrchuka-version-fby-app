/*
let getProfileData2


$(document).ready(function () {
  getProfileData2 = function () {
    $.ajax({
      type: "get", url: `${domain}/api/v1/auth` + `?token=` + `Bearer ${atob(localStorage.getItem("myUser"))}`,
      dataType: 'json',
      encode: true,
      headers: {
        "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`
      },
      success: function (data) {

        if (data.data.user.notification) {
          Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
              console.log('Notification permission granted.');
            } else {
              console.log('Notification permission denied.');
            }
          });
        }

      },
      error: function (request, status, error) {

      }
    });
  }

  getProfileData2()
})
*/
/*

const convertedVapidKey = urlBase64ToUint8Array("BMSXqJZFV5DAa58HYMhr_MwH8-rg2CCnCLX-EFyxmjF12lF9Ve7HxbRKkKTK1BjgaTvP38svJx5vbPb3pPxuDSw")

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}


if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', function() {


    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        return registration.pushManager.getSubscription()
          .then(function(subscription) {
            if (!subscription) {
              // The user has not subscribed to push notifications
              return subscribeUserToPush(registration);
            }
            // Update the subscription object on the server
            return updateSubscriptionOnServer(subscription);
          });
      })
      .catch(function(error) {
        console.error('Service worker registration failed:', error);
      });
  });
}

function subscribeUserToPush(registration) {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:convertedVapidKey
  })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);
      // Update the subscription object on the server
      return updateSubscriptionOnServer(subscription);
    })
    .catch(function(error) {
      console.error('Failed to subscribe the user: ', error);
    });
}

function updateSubscriptionOnServer(subscription) {

  return fetch(`${domain}/api/v1/util/store_or_update_subscription`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`,
      'Content-Type': 'application/json'
    },
  })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Bad status code from server.');
      }
      return response.json();
    })
    .then(function(responseData) {

      if (!(responseData.message && responseData.status)) {
        throw new Error('Bad response from server.');
      }
    });
}
*/

let myCoor
getLatAndLon(function(latLon) {
  myCoor= latLon;
})



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

function initializeFireBaseMessaging(){

  messaging.requestPermission().then(() => {
    console.log('Notification permission granted.');

    messaging.getToken().then((token) => {
      console.log('Device token:', token)
      getLatAndLon(function(latLon) {
            
        fetch(`${domain}/api/v1/util/store_or_update_subscription`, {
          method: 'POST',
          body: JSON.stringify({
            token: token,
            latitude: Number(latLon.lat).toFixed(8),
            longitude: Number(latLon.lon).toFixed(8)
          }),
          headers: {
            "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`,
            'Content-Type': 'application/json'
          },
        })
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Bad status code from server.');
          }
          return response.json();
        })
        .then(function(responseData) {
          if (!(responseData.message && responseData.status)) {
            throw new Error('Bad response from server.');
          }
        })
      })

    });
  }).catch((err) => {
    console.log('Unable to get permission to notify.', err);
  });

}


messaging.onMessage((payload) => {
  console.log('Message received. Payload:', payload);
  let data=payload.data.json()

  const options = {
      title: data.notification.title,
      body: data.notification.body,
      icon: data.notification.icon,
      vibrate: data.notification.vibration,
      icon: data.notification.image ||'assets/img/logo.png',
  }
  self.registration.showNotification(data.notification.title,options)


});


messaging.onTokenRefresh((payload) => {
  messaging.getToken().then((token) => {
    console.log('Device token:', token);
    console.log('coor:', myCoor);


    fetch(`${domain}/api/v1/util/store_or_update_subscription`, {
      method: 'POST',
      body: JSON.stringify({
        token: token,
        latitude: Number(myCoor.lat).toFixed(8),
        longitude: Number(myCoor.lon).toFixed(8)
      }),
      headers: {
        "Authorization": `Bearer ${atob(localStorage.getItem("myUser"))}`,
        'Content-Type': 'application/json'
      },
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Bad status code from server.');
      }
      return response.json();
    })
    .then(function(responseData) {
      if (!(responseData.message && responseData.status)) {
        throw new Error('Bad response from server.');
      }
    })

  });

})

initializeFireBaseMessaging()