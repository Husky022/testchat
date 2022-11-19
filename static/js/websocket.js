$(document).ready(function () {
    if (window.location.pathname.toString().indexOf('chat')>0) {

        const el = $(".write-space")[0];
        el.scrollTop = el.scrollHeight;

        const messagesSpace = document.querySelector('.write-space')
        const messageInput = document.querySelector('.input-box')
        const sendButton = document.querySelector('.send-message-button')
        const userName = document.querySelector('#username')

        let wsClient = new WebSocket('ws://127.0.0.1:21300')

        wsClient.onopen = () => {
            const serviceData = {
                'service_info': window.location.pathname.toString().slice(6, -1),
                'username': userName.textContent
            }
            wsClient.send(JSON.stringify(serviceData))
            sendButton.onclick = () => {
                let date = new Date(Date.now())
                date.setHours(date.getHours() + 3);
                let data = {
                    'chat_id': window.location.pathname.toString().slice(6, -1),
                    'data': messageInput.value,
                    'from': userName.textContent,
                    'datetime': date
                }
                if (messageInput.value !== ''){
                    wsClient.send(JSON.stringify(data))
                    messageInput.value = '';
                }

            }
        }

        wsClient.onmessage = (message) => {

            const msg = JSON.parse(message.data)
            console.log(msg)
            if ('persons' in msg){
                console.log('yes')
                const personsOnline = document.querySelector('#persons-online')
                console.log(msg.persons)
                personsOnline.textContent = msg.persons
            } else {
                const newMessage = document.createElement('div')
                newMessage.className = 'message-box'

                if (userName.textContent === msg.from) {
                    newMessage.innerHTML = '<div class="message-box">\n' +
                        '                      <div class="message-box-arrow-from"></div>\n' +
                        '                      <div class="message-from-me">\n' +
                        '                        <div class="message-text-from-me">\n' +
                        '                            <p>\n' +
                        msg.data +
                        '                            </p>\n' +
                        '                        </div>\n' +
                        '                        <div class="message-time from">\n' +
                        msg.datetime.slice(11, -8) +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>'
                    messagesSpace.appendChild(newMessage)
                } else {
                    newMessage.innerHTML = '<div class="message-box">\n' +
                        '                    <div class="message-box-arrow-to"></div>\n ' +
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
                        '                    </div>\n' +
                        '                </div>'
                    messagesSpace.appendChild(newMessage)
                }
                messagesSpace.scrollTop = messagesSpace.scrollHeight;
            }


        }
    }
})


