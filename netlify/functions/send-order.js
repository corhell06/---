exports.handler = async function(event, context) {
    // Разрешаем только POST-запросы
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Метод не разрешен' })
        };
    }

    try {
        const orderData = JSON.parse(event.body);
        
        // ✅ Берем токен из переменных окружения
        const BOT_TOKEN = process.env.BOT_TOKEN;
        
        if (!BOT_TOKEN) {
            console.error('❌ BOT_TOKEN не найден в переменных окружения!');
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Ошибка конфигурации сервера' 
                })
            };
        }
        
        const message = formatOrderMessage(orderData);
        
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: orderData.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true })
            };
        } else {
            console.error('Telegram API error:', data);
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false, 
                    error: data.description || 'Ошибка Telegram API' 
                })
            };
        }
    } catch (error) {
        console.error('Server error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                error: 'Внутренняя ошибка сервера' 
            })
        };
    }
};

function formatOrderMessage(orderData) {
    let message = `🛒 <b>Новый заказ!</b>\n\n`;
    message += `👤 <b>Имя:</b> ${orderData.name}\n`;
    message += `📞 <b>Телефон:</b> ${orderData.phone}\n`;
    
    if (orderData.comment) {
        message += `💬 <b>Комментарий:</b> ${orderData.comment}\n`;
    }
    
    message += `\n📋 <b>Заказ:</b>\n`;
    
    orderData.order.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - ${item.price * item.quantity}₽\n`;
        if (item.options && item.options.length > 0) {
            message += `   Дополнительно: ${item.options.join(', ')}\n`;
        }
        message += `   ${item.serviceType}\n`;
    });
    
    message += `\n💰 <b>Итого:</b> ${orderData.totalAmount}₽`;
    message += `\n📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}`;
    
    return message;
}