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

            let unreadMessages = document.querySelectorAll('.message-box.unread')
            console.log(unreadMessages)


            $(".write-space").on("mouseenter", ".unread", function(){

                console.log($(this).attr('id'));
                let msg_id = $(this).attr('id')

                let data_status_msg = {
                    'msg_id': msg_id,
                    'status_info': 'readed'
                }
                wsClient.send(JSON.stringify(data_status_msg));
                // $(this).attr('class', 'message-box');
                // var a = $(this).find('.for-change').attr('src')
                // b = a.replace('.png','-red.png');
                // $(this).children('img').attr('src', b)
            });

            sendButton.onclick = () => {
                if (messageInput.value !== ''){
                    let message_id = 'msg-' + Math.round(Math.random() * 1000000)
                    let date = new Date(Date.now())
                    date.setHours(date.getHours() + 3);
                    let date_str = date.getHours() + ':' + date.getMinutes();
                    const newMessage = document.createElement('div');
                    newMessage.innerHTML = '<div id="' + message_id + '" class="message-box">\n' +
                        '                      <div class="message-box-arrow-from"></div>\n' +
                        '                      <div class="message-from-me">\n' +
                        '                        <div class="message-text-from-me">\n' +
                        '                            <p>\n' +
                        messageInput.value +
                        '                            </p>\n' +
                        '                        </div>\n' +
                        '                        <div>\n' +
                        '                           <div class="message-status">\n' +
                        '                                <svg id="status-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white"\n' +
                        '                                class="bi bi-check" viewBox="2 0 10 16">\n' +
                        '                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>\n' +
                        '                                </svg>\n' +
                        '                           </div>\n' +
                        '                           <div class="message-time from">\n' +
                        date_str +
                        '                           </div>\n' +
                        '                         </div>\n' +
                        '                    </div>\n' +
                        '                </div>'
                    messagesSpace.appendChild(newMessage);
                    messagesSpace.scrollTop = messagesSpace.scrollHeight;

                    let data = {
                        'chat_id': window.location.pathname.toString().slice(6, -1),
                        'data': messageInput.value,
                        'from': userName.textContent,
                        'datetime': date,
                        'msg_id': message_id
                    }
                    // console.log(message_id);
                    wsClient.send(JSON.stringify(data));
                    messageInput.value = '';
                }

            }
        }

        wsClient.onmessage = (message) => {
            const msg = JSON.parse(message.data);
            // console.log(msg);

            if ('persons' in msg) {
                // console.log('yes');
                const personsOnline = document.querySelector('#persons-online');
                // console.log(msg.persons);
                personsOnline.textContent = msg.persons;
            } else if ('status' in msg){
                if (msg.status === 'delivered'){
                    console.log(msg.msg_id);
                    let messageStatus = $('#' + msg.msg_id + '').find( ".message-status" )[0];
                    console.log(messageStatus)
                    messageStatus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white"' +
                    '                            class="bi bi-check-all" viewBox="2 0 10 16">' +
                    '                            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 ' +
                                                 '4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 ' +
                                                  '1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 ' +
                                                  '.02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 ' +
                                                 '0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>\n' +
                    '                            </svg>'
                    console.log('done')
                } else if (msg.status === 'readed'){

                    console.log(msg);
                    console.log(msg.msg_id);
                    let messageStatus = $('#' + msg.msg_id + '').find( ".message-status" )[0];
                    console.log(messageStatus)
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
                let newMessage = document.createElement('div');
                newMessage.setAttribute("class", "message-box unread");
                newMessage.setAttribute("id", msg.msg_id);
                // newMessage.className = 'message-box unread';

                if (userName.textContent === msg.from) {

                } else {
                    newMessage.innerHTML = '<div class="message-box-arrow-to"></div>\n ' +
                        '                    <div class="message-to-me">\n' +
                        '                        <div class="message-username">\n' +
                        msg.from +
                        '                        </div>\n' +
                        '                        <div class="message-text-to-me">\n' +
                        '                            <p>\n' +
                        msg.data +
                        '                            </p>\n' +
                        '                        </div>\n' +
                        '                        <div class="message-time to">\n' +
                        msg.datetime.slice(11, -8) +
                        '                        </div>\n' +
                        '                    </div>\n'
                    messagesSpace.appendChild(newMessage);
                }
                messagesSpace.scrollTop = messagesSpace.scrollHeight;
                let unreadMessages = document.querySelectorAll('.unread')
                console.log(unreadMessages)
            }


        }
    }
})


