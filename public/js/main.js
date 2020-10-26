const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get Username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();


//Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
   outputRoomName(room);
   outputUsers(users);
});

socket.on('message', message => {
    console.log(message);
    
    // Message from server
    outputMessage(message);
    
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

    
})

// Message subimt

chatForm.addEventListener('submit', (e) => {
   e.preventDefault();
   
   // get msg chat
   const msg = e.target.elements.msg.value;
   
   // Emit msg to the server
   socket.emit('chatMessage', msg);
   
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
   
});


// output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}