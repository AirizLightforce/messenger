import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            text TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def add_message(username, text):
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute('INSERT INTO messages (username, text) VALUES (?, ?)',
              (username, text))
    conn.commit()
    message_id = c.lastrowid
    conn.close()
    return message_id

def get_messages(limit=50):
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute('''
        SELECT id, username, text, timestamp 
        FROM messages 
        ORDER BY timestamp DESC 
        LIMIT ?
    ''', (limit,))
    messages = c.fetchall()
    conn.close()
    
    # Форматируем для JSON
    return [
        {
            'id': msg[0],
            'username': msg[1],
            'text': msg[2],
            'timestamp': msg[3]
        }
        for msg in messages
    ]