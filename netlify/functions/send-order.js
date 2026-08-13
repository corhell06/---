// netlify/functions/send-order.js
exports.handler = async function(event, context) {
    // Разрешаем только POST-запросы
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Метод не разрешен' })
        };
    }

    try {
        // 1. Проверяем наличие BOT_TOKEN
        const BOT_TOKEN = process.env.BOT_TOKEN;
        if (!BOT_TOKEN) {
            console.error('❌ BOT_TOKEN не найден в переменных окружения!');
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'BOT_TOKEN не настроен. Добавьте переменную окружения в Netlify.' 
                })
            };
        }

        // 2. Парсим данные
        let orderData;
        try {
            orderData = JSON.parse(event.body);
        } catch (parseError) {
            console.error('❌ Ошибка парсинга JSON:', parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Неверный формат данных' 
                })
            };
        }

        // 3. Проверяем наличие chatId
        if (!orderData.chatId) {
            console.error('❌ Chat ID отсутствует в запросе');
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Отсутствует Chat ID' 
                })
            };
        }

        // 4. Форматируем сообщение
        const message = formatOrderMessage(orderData);
        console.log('📤 Отправка сообщения в Telegram...');

        // 5. Отправляем в Telegram
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const telegramResponse = await fetch(telegramUrl, {
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

        const telegramData = await telegramResponse.json();
        console.log('📥 Ответ от Telegram:', telegramData);

        // 6. Проверяем ответ Telegram
        if (telegramData.ok) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: true,
                    message: 'Заказ успешно отправлен!'
                })
            };
        } else {
            console.error('❌ Ошибка Telegram API:', telegramData);
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: telegramData.description || 'Ошибка отправки в Telegram' 
                })
            };
        }

    } catch (error) {
        console.error('❌ Общая ошибка:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Внутренняя ошибка сервера: ' + error.message 
            })
        };
    }
};

// Функция форматирования сообщения
function formatOrderMessage(orderData) {
    let message = `🛒 <b>Новый заказ!</b>\n\n`;
    message += `👤 <b>Имя:</b> ${orderData.name || 'Не указано'}\n`;
    message += `📞 <b>Телефон:</b> ${orderData.phone || 'Не указан'}\n`;
    
    if (orderData.comment) {
        message += `💬 <b>Комментарий:</b> ${orderData.comment}\n`;
    }
    
    message += `\n📋 <b>Заказ:</b>\n`;
    
    if (orderData.order && orderData.order.length > 0) {
        orderData.order.forEach((item, index) => {
            message += `${index + 1}. ${item.name} x${item.quantity} - ${item.price * item.quantity}₽\n`;
            if (item.options && item.options.length > 0) {
                message += `   Дополнительно: ${item.options.join(', ')}\n`;
            }
            message += `   ${item.serviceType || 'В зале'}\n`;
        });
    } else {
        message += `Пустой заказ\n`;
    }
    
    message += `\n💰 <b>Итого:</b> ${orderData.totalAmount || 0}₽`;
    message += `\n📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}`;
    
    return message;
}
