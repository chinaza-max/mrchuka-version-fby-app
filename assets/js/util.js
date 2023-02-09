let getCurrentUser = () => {
    let currentUser = JSON.parse(atob(localStorage.userDetails));
    return currentUser;
}

let getUserProfilePic = () => {
    let user = getCurrentUser();
    let userProfilePic = user.image ?? '';
    return userProfilePic;
}

function setUserImageForChat(){
    var userImage = getUserProfilePic();
    var images = document.querySelectorAll('.chat-msg.owner img');
    images.forEach(image => {
        image.setAttribute('src', userImage);
    });
}

setUserImageForChat();