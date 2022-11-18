import asyncio
import sqlite3
import websockets
import json

clients_dict = {}  # key - client_id : value - chat_id


def parse_message(msg_dict):
    msg_tuple = (
        msg_dict['data'],
        msg_dict['chat_id'],
        msg_dict['from'],
        msg_dict['datetime'].split('T')[0],
        msg_dict['datetime'].split('T')[1][:5],
        False
    )
    return msg_tuple


def db_add_message(msg):
    conn = sqlite3.connect('db.sqlite3')
    curr = conn.cursor()
    curr.execute("INSERT INTO chatapp_message(text, chat_id, from_user, date_client, time_client, is_read)"
                 " VALUES(?, ?, ?, ?, ?, ?);",
                 parse_message(msg))
    conn.commit()
    conn.close()


async def send_message(message):
    msg_dict = json.loads(message)
    for client, chat_id in clients_dict.items():
        if msg_dict['chat_id'] == chat_id:
            await client.send(message)


async def user_disconnected(client_socket):
    del clients_dict[client_socket]


async def new_client_connected(client_socket):
    try:
        while True:
            new_message = await client_socket.recv()
            msg_dict = json.loads(new_message)
            if msg_dict.get('service_info', None):
                chat_id = msg_dict.get('service_info')
                clients_dict[client_socket] = chat_id
            else:
                db_add_message(msg_dict)
                await send_message(message=new_message)
    except websockets.ConnectionClosedOK or ConnectionResetError:
        print('ошибочка')
    finally:
        await user_disconnected(client_socket)


async def start_server():
    await websockets.serve(new_client_connected, '127.0.0.1', 21300)


if __name__ == '__main__':
    event_loop = asyncio.get_event_loop()
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()
