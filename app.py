from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import database

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с других доменов

# Инициализируем БД при запуске
database.init_db()

@app.route('/')
def index():
    return render_template('index.html')

# API endpoints
@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Получить все сообщения"""
    messages = database.get_messages()
    return jsonify(messages)

@app.route('/api/messages', methods=['POST'])
def post_message():
    """Отправить новое сообщение"""
    data = request.json
    
    if not data or 'username' not in data or 'text' not in data:
        return jsonify({'error': 'Missing username or text'}), 400
    
    username = data['username'].strip()
    text = data['text'].strip()
    
    if not username or not text:
        return jsonify({'error': 'Username and text cannot be empty'}), 400
    
    message_id = database.add_message(username, text)
    
    return jsonify({
        'id': message_id,
        'username': username,
        'text': text,
        'message': 'Message sent successfully'
    }), 201

@app.route('/api/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    """Удалить сообщение (опционально)"""
    # Здесь можно добавить удаление сообщения
    return jsonify({'message': 'Delete functionality coming soon'}), 501

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)