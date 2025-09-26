// script.js

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Ваши данные ---
  const apiKey = 'F05EEF9FA56CE1649E0E3FA946D616F7'; 
  const steamID64 = '76561199216268050'; 
  // -------------------

  // Оригинальный URL к Steam API
  const originalApiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamID64}`;
  
  // Оборачиваем его в URL стабильного прокси-сервиса, чтобы избежать ошибок CORS
  const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(originalApiUrl)}`;

  // Находим на странице контейнер для карточки профиля
  const profileContainer = document.getElementById('steam-profile-card');

  // Отправляем запрос к API через прокси
  fetch(apiUrl)
    .then(response => {
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error(`Сетевая ошибка! Статус: ${response.status}`);
      }
      // Преобразуем ответ в формат JSON
      return response.json();
    })
    .then(data => {
      // Извлекаем данные игрока из ответа
      const player = data.response.players[0];

      // Если игрок найден, формируем HTML
      if (player) {
        let statusText, statusClass;

        // Определяем статус и CSS-класс для его отображения
        switch (player.personastate) {
          case 0: statusText = 'Не в сети'; statusClass = 'status-offline'; break;
          case 1: statusText = 'В сети'; statusClass = 'status-online'; break;
          case 2: statusText = 'Занят'; statusClass = 'status-busy'; break;
          case 3: statusText = 'Нет на месте'; statusClass = 'status-away'; break;
          default: statusText = 'Статус неизвестен'; statusClass = 'status-offline';
        }

        // Если игрок в игре, этот статус важнее
        if (player.gameextrainfo) {
          statusText = `Играет в ${player.gameextrainfo}`;
          statusClass = 'status-ingame';
        }

        // Создаем HTML-разметку для карточки
        const profileHTML = `
          <img src="${player.avatarfull}" alt="Аватар Steam" class="avatar">
          <div class="profile-info">
            <h3><a href="${player.profileurl}" target="_blank" rel="noopener noreferrer">${player.personaname}</a></h3>
            <p class="${statusClass}"><b>Статус:</b> ${statusText}</p>
            ${player.loccountrycode ? `<p><b>Страна:</b> ${player.loccountrycode}</p>` : ''}
          </div>
        `;

        // Вставляем готовую разметку в наш контейнер на странице
        profileContainer.innerHTML = profileHTML;

      } else {
        // Если профиль по ID не найден
        profileContainer.innerHTML = '<p>Не удалось найти профиль Steam с таким ID.</p>';
      }
    })
    .catch(error => {
      // Если на любом этапе произошла ошибка (сеть, прокси, и т.д.)
      console.error('Ошибка при запросе к API:', error);
      profileContainer.innerHTML = `<p style="color: #e53935;"><b>Ошибка при загрузке данных.</b><br>Проверьте консоль браузера (F12) для деталей.</p>`;
    });
});
