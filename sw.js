self.addEventListener("push", (event) => {
    console.log("we are here")
    const data=event.data.json();
    self.registration.showNotification(data.title,{
        body:"notification from node js"    
    })
})
