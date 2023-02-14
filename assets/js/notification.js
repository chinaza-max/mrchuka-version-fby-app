
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
    userVisibleOnly: true
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

      console.log(responseData)
      if (!(responseData.message && responseData.status)) {
        throw new Error('Bad response from server.');
      }
    });
}
