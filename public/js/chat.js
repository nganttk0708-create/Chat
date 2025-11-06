// Client Send Message
const formSendData = document.querySelector('.chat-window .inner-form');
console.log('formSendData', formSendData);

if (formSendData) {
    formSendData.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value.trim();
        console.log('Sending message:', content);

        if (content) {
            socket.emit('client-send-message', content);
            e.target.elements.content.value = '';
            socket.emit('client-typing', 'hidden');
        }
    });
}
// End Client Send Message


// Server Return Message
socket.on('server-return-message', (data) => {
    const myID = document.querySelector('.chat-window').getAttribute('my-id');
    const chatWindow = document.querySelector('.chat-window .inner-body');
    const boxTyping = document.querySelector('.chat-window .inner-list-typing');

    const messageDiv = document.createElement('div');
    let htmlFullName = '';

    if (data.userID == myID) {
        messageDiv.classList.add('inner-outgoing');
    } else {
        htmlFullName = `<div class='inner-name'>${data.fullName}</div>`;
        messageDiv.classList.add('inner-incoming');
    }

    messageDiv.innerHTML = `
        ${htmlFullName}
        <div class='inner-content'>${data.content}</div>
    `;

    chatWindow.insertBefore(messageDiv, boxTyping);

    chatWindow.scrollTop = chatWindow.scrollHeight;
});
// End Server Return Message


// Scroll to Bottom Chat Window
const chatWindowBody = document.querySelector('.chat-window .inner-body');
if (chatWindowBody) {
    chatWindowBody.scrollTop = chatWindowBody.scrollHeight;
}
// End Scroll

// Icon Chat - Show Popup
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('show');
    };
}
// End Show Popup

// Show Typing
var timeOut
const showTyping = () => {
    socket.emit('client-typing', 'show');

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit('client-typing', 'hidden');
    }, 3000)
}

// End Show Typing

// Emoji Picker
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const inputChat = document.querySelector('.inner-form input[name="content"]');

    emojiPicker.addEventListener('emoji-click', event => {
        const icon = event.detail.unicode;
        inputChat.value += icon;

        const end = inputChat.value.length
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping()
    });

    // input keyup - typing indicator

    inputChat.addEventListener('keyup', showTyping);
}
// End Emoji Picker


// Server Return Typing
const elementListTyping = document.querySelector('.chat-window .inner-list-typing');
if (elementListTyping) {
    socket.on('server-return-typing', (data) => {
        if (data.type == 'show') {
            const existTyping = elementListTyping.querySelector(`[user-id='${data.user_id}']`);
            const chatWindow = document.querySelector('.chat-window .inner-body');

            if (!existTyping) {
                const boxTyping = document.createElement('div');
                boxTyping.classList.add('box-typing');
                boxTyping.setAttribute('user-id', data.user_id);

                boxTyping.innerHTML = `
                    <div class='inner-name'>${data.fullName}</div>
                    <div class='inner-dots'>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);
            }
            chatWindow.scrollTop = chatWindow.scrollHeight;

        }
        else{
            const boxTypingRemove = elementListTyping.querySelector(`[user-id='${data.user_id}']`)
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}
// End Server Return Typing
