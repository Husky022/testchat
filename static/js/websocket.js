$(document).ready(function () {
    if (window.location.pathname.toString().indexOf('chat')>0) {

        const el = $(".write-space")[0];
        el.scrollTop = el.scrollHeight;

        const messagesSpace = document.querySelector('.write-space');
        const messageInput = document.querySelector('.input-box');
        const sendButton = document.querySelector('.send-message-button');
        const userName = document.querySelector('#username');

        let wsClient = new WebSocket('ws://127.0.0.1:21300');

        wsClient.onopen = () => {
            const serviceData = {
                'service_info': window.location.pathname.toString().slice(6, -1),
                'username': userName.textContent
            }
            wsClient.send(JSON.stringify(serviceData));

            $(".write-space").on("mouseenter", ".unread", function(){

                let data_status_msg = {
                    'msg_id': $(this).attr('id'),
                    'status_info': 'readed',
                    'from': $(this).find('.message-username').text()
                }
                $(this).attr('class', 'message-box')
                wsClient.send(JSON.stringify(data_status_msg));
            });

            sendButton.onclick = () => {
                if (messageInput.value !== ''){
                    let message_id = 'msg-' + Math.round(Math.random() * 1000000)
                    let date = new Date();
                    let date_str = date.toLocaleDateString();
                    let time_str = date.toLocaleTimeString().slice(0,-3);
                    const newMessage = document.createElement('div');
                    let separator = $('.separator:last')
                    if (separator.text() === 'Сообщений пока что нет...'){
                        separator.html(date_str)
                    }
                    else if (separator.text() !== date_str){
                        const newSeparator = document.createElement('div');
                        newSeparator.innerHTML = '<div class="separator">' + date_str + '</div>'
                        messagesSpace.appendChild(newSeparator);
                    }
                    newMessage.innerHTML = '<div id="' + message_id + '" class="message-box">' +
                                             '<div class="message-box-arrow-from"></div>' +
                                                '<div class="message-from-me">' +
                                                    '<div class="message-text-from-me">' +
                                                        '<p>' +
                                                            messageInput.value +
                                                        '</p>' +
                                                    '</div>' +
                                                    '<div>' +
                                                     '<div class="message-status">' +
                                                        '<svg id="status-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white"' +
                                                            'class="bi bi-check" viewBox="2 0 10 16">' +
                                                            '<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>' +
                                                        '</svg>' +
                                                    '</div>' +
                                                    '<div class="message-time from">' +
                                                        time_str +
                                                    '</div>' +
                                                 '</div>' +
                                            '</div>' +
                                        '</div>'
                    messagesSpace.appendChild(newMessage);
                    messagesSpace.scrollTop = messagesSpace.scrollHeight;

                    let data = {
                        'chat_id': window.location.pathname.toString().slice(6, -1),
                        'data': messageInput.value,
                        'from': userName.textContent,
                        'date': date_str,
                        'time': time_str,
                        'msg_id': message_id
                    }
                    wsClient.send(JSON.stringify(data));
                    messageInput.value = '';
                }

            }
        }

        wsClient.onmessage = (message) => {
            const msg = JSON.parse(message.data);
            if ('persons' in msg) {
                const personsOnline = document.querySelector('#persons-online');
                personsOnline.textContent = msg.persons;
            } else if ('status' in msg){
                if (msg.status === 'delivered'){
                    let messageStatus = $('#' + msg.msg_id + '').find( ".message-status" )[0];
                    messageStatus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white"' +
                    '                            class="bi bi-check-all" viewBox="2 0 10 16">' +
                    '                            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 ' +
                                                 '4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 ' +
                                                  '1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 ' +
                                                  '.02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 ' +
                                                 '0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>\n' +
                    '                            </svg>'
                } else if (msg.status === 'readed'){
                    let messageStatus = $('#' + msg.msg_id + '').find( ".message-status" )[0];
                    messageStatus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#EF5DA8"' +
                    '                            class="bi bi-check-all" viewBox="2 0 10 16">' +
                    '                            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 ' +
                                                 '4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 ' +
                                                 '1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 ' +
                                                    '.02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 ' +
                                                    '0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>\n' +
                    '                            </svg>'
                }
            }  else {
                let separator = $('.separator:last')
                    if (separator.text() === 'Сообщений пока что нет...'){
                        separator.html(msg.date)
                    }
                    else if (separator.text() !== msg.date){
                        const newSeparator = document.createElement('div');
                        newSeparator.innerHTML = '<div class="separator">' + msg.date + '</div>'
                        messagesSpace.appendChild(newSeparator);
                    }
                let newMessage = document.createElement('div');
                newMessage.setAttribute("class", "message-box unread");
                newMessage.setAttribute("id", msg.msg_id);
                if (userName.textContent === msg.from) {
                } else {
                    newMessage.innerHTML = '<div class="message-box-arrow-to"></div>' +
                                             '<div class="message-to-me">' +
                                                '<div class="message-username">' +
                                                    msg.from +
                                                '</div>' +
                                                '<div class="message-text-to-me">' +
                                                    '<p>' +
                                                        msg.data +
                                                    '</p>' +
                                                '</div>' +
                                                '<div class="message-time to">' +
                                                    msg.time +
                                                '</div>' +
                                            '</div>'
                    messagesSpace.appendChild(newMessage);
                }
                messagesSpace.scrollTop = messagesSpace.scrollHeight;
            }
        }
    }
})


