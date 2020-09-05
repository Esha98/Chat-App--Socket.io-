const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const socket = io();

//Messsage from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll Down
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;
    
    //Emit message to server
    socket.emit('chatMessage',msg);

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
       ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}