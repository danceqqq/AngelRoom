// Событие, которое сработает после полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
  
  // --- ВАШИ ДАННЫЕ УЖЕ ВСТАВЛЕНЫ ---
  const apiKey = 'F05EEF9FA56CE1649E0E3FA946D616F7'; 
  const steamID64 = '76561199216268050'; 
  // ------------------------------------

  // URL для запроса основной информации о пользователе
  // Используем прокси, чтобы обойти CORS-ограничения, которые могут возникнуть
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = `${proxyUrl}https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamID64}`;

  const profileContainer = document.getElementById('steam-profile-card');

  // Делаем запрос к API Steam через прокси
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Получаем информацию о первом (и единственном) игроке в ответе
      const player = data.response.players[0];

      if (player) {
        let statusText, statusClass;

        // Определяем статус и соответствующий CSS класс
        switch (player.personastate) {
          case 0:
            statusText = 'Не в сети';
            statusClass = 'status-offline';
            break;
          case 1:
            statusText = 'В сети';
            statusClass = 'status-online';
            break;
          case 2:
            statusText = 'Занят';
            statusClass = 'status-busy';
            break;
          case 3:
            statusText = 'Нет на месте';
            statusClass = 'status-away';
            break;
          default:
            statusText = 'Статус неизвестен';
            statusClass = 'status-offline';
        }

        // Если игрок в игре, этот статус имеет приоритет
        if (player.gameextrainfo) {
          statusText = `Играет в ${player.gameextrainfo}`;
          statusClass = 'status-ingame';
        }

        // Формируем HTML-код с полученными данными
        const profileHTML = `
          <img src="${player.avatarfull}" alt="Аватар Steam" class="avatar">
          <div class="profile-info">
            <h3><a href="${player.profileurl}" target="_blank" rel="noopener noreferrer">${player.personaname}</a></h3>
            <p class="${statusClass}"><b>Статус:</b> ${statusText}</p>
            ${player.loccountrycode ? `<p><b>Страна:</b> ${player.loccountrycode}</p>` : ''}
          </div>
        `;

        // Вставляем готовый HTML в наш контейнер
        profileContainer.innerHTML = profileHTML;

      } else {
        profileContainer.innerHTML = '<p>Не удалось найти профиль Steam с таким ID.</p>';
      }
    })
    .catch(error => {
      console.error('Ошибка при запросе к Steam API:', error);
      profileContainer.innerHTML = `<p style="color: #e53935;"><b>Ошибка при загрузке данных.</b><br>Возможно, API Steam недоступен или CORS-прокси требует активации.</p>`;
    });
});
