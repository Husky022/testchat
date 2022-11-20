import asyncio
import sqlite3
import websockets
import json
import time

clients_dict = {}  # key - client_id (websocket) : value - (chat_id, username)


def parse_message(msg_dict):
    print(msg_dict)
    msg_tuple = (
        msg_dict['msg_id'],
        msg_dict['data'],
        msg_dict['chat_id'],
        msg_dict['from'],
        msg_dict['datetime'].split('T')[0],
        msg_dict['datetime'].split('T')[1][:5],
        False
    )
    return msg_tuple


def info_msg(chat_id):
    return {
        'chat_id': chat_id,
        'persons': len(list(filter(lambda x: (x[0] == chat_id), set(clients_dict.values()))))
    }


def db_add_message(msg):
    conn = sqlite3.connect('db.sqlite3')
    curr = conn.cursor()
    curr.execute("INSERT INTO chatapp_message(msg_id, text, chat_id, from_user, date_client, time_client, is_read)"
                 " VALUES(?, ?, ?, ?, ?, ?, ?);",
                 parse_message(msg))
    conn.commit()
    conn.close()


def db_change_message_status(status, msg_id):
    conn = sqlite3.connect('db.sqlite3')
    curr = conn.cursor()
    curr.execute('''UPDATE chatapp_message SET is_read = ? WHERE id = ?''', (status, msg_id))
    conn.commit()
    conn.close()


async def send_message(msg_dict):
    message = json.dumps(msg_dict)
    for client, client_data in clients_dict.items():
        if msg_dict['chat_id'] == client_data[0]:
            await client.send(message)


async def user_disconnected(client_socket):
    chat_id = clients_dict[client_socket][0]
    del clients_dict[client_socket]
    await send_message(info_msg(chat_id))
    print(clients_dict)
    print(set(clients_dict.values()))


async def new_client_connected(client_socket):
    try:
        while True:
            new_message = await client_socket.recv()
            msg_dict = json.loads(new_message)
            if msg_dict.get('service_info', None):
                chat_id = msg_dict.get('service_info')
                user_name = msg_dict.get('username')
                clients_dict[client_socket] = chat_id, user_name
                await send_message(info_msg(chat_id))
                print(clients_dict)
                print(set(clients_dict.values()))
            elif msg_dict.get('status_info', None):
                print(msg_dict)
                msg_id = msg_dict['msg_id']
                db_change_message_status(True, msg_id)
                status_message = {
                    'status': 'readed',
                    'msg_id': msg_id,
                    'chat_id': clients_dict[client_socket][0],
                }
                await send_message(status_message)
            else:
                db_add_message(msg_dict)
                time.sleep(1)  # оставил специально для демонстрации, как приходит подтвеждение
                status_message = json.dumps({'status': 'delivered', 'msg_id': msg_dict['msg_id']})
                await client_socket.send(status_message)
                await send_message(msg_dict)
    except websockets.exceptions.ConnectionClosedOK or ConnectionResetError:
        await user_disconnected(client_socket)


async def start_server():
    await websockets.serve(new_client_connected, '127.0.0.1', 21300)


if __name__ == '__main__':
    event_loop = asyncio.get_event_loop()
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()
