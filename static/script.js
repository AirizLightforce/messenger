// Загружаем сообщения при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadMessages();
    
    // Обработчик отправки формы
    document.getElementById('messageForm').addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
    });
    
    // Автообновление каждые 10 секунд
    setInterval(loadMessages, 10000);
});

// Функция загрузки сообщений
function loadMessages() {
    fetch('/api/messages')
        .then(response => response.json())
        .then(messages => {
            displayMessages(messages);
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Не удалось загрузить сообщения');
        });
}

// Функция отправки сообщения
function sendMessage() {
    const username = document.getElementById('username').value.trim();
    const text = document.getElementById('message').value.trim();
    
    if (!username || !text) {
        alert('Заполните все поля!');
        return;
    }
    
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            text: text
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Ошибка: ' + data.error);
        } else {
            document.getElementById('message').value = ''; // Очищаем только поле сообщения
            loadMessages(); // Перезагружаем сообщения
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при отправке сообщения');
    });
}

// Функция отображения сообщений
function displayMessages(messages) {
    const container = document.getElementById('messagesContainer');
    
    if (messages.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #718096;">Нет сообщений. Будьте первым!</div>';
        return;
    }
    
    let html = '';
    messages.reverse(); // Показываем сначала старые сообщения
    
    messages.forEach(msg => {
        const date = new Date(msg.timestamp + ' UTC');
        const timeString = date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="message">
                <div class="message-header">
                    <span class="username">${escapeHtml(msg.username)}</span>
                    <span class="timestamp">${timeString}</span>
                </div>
                <div class="message-text">${escapeHtml(msg.text)}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    container.scrollTop = container.scrollHeight; // Скролл вниз
}

// Защита от XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = `<div style="text-align: center; color: #e53e3e; padding: 20px;">
        ❌ ${message}
    </div>`;
}