# TopProgressBarPlugin

Пользователя важно информировать о процессе загрузке. Часто это анимации или индикаторы непосредственно в месте загрузки, например, внутри кнопки или на месте будущего отображения данных. Также удобно иметь некоторый глобальный универсальный индикатор процесса загрузки, например, прогресс бар в верхней части страницы.

## Компонент TheTopProgressBar

Требуется реализовать компонент `TheTopProgressBar` - глобальную полоску загрузки, отображаемую в верхней части страницы.

Компонент должен иметь три метода:
- `start` - запускает прогресс загрузки (полоска начинает увеличиваться);
- `finish` - завершает прогресс загрузки (полоска доходит до конца и исчезает);
- `fail` - окрашивает полоску в красный цвет и завершает прогресс загрузки.

**Повторный вызов метода должен игнорироваться (например, запуск `start`, когда прогресс уже запустился).**

Полоска выводится элементом с классом `.progress`:
- Текущий прогресс — ширина полоски `width` в процентах;
- Полоска изначально скрыта нулевой шириной и прозрачностью `opacity: 0`;
- Полоска становится видимой с классом `.show`;
- Полоска становится красной с классом `.failed`;
- Для плавности изменения прозрачности используется `CSS transition`.

Технически HTTP позволяет отслеживать реальный [прогресс](https://learn.javascript.ru/xhr-onprogress) получения ответа на запрос через XHR. Однако в общем случае это нетривиальная задача. Сервер должен выдавать точный `Content-Length`, запросов может быть множество, а загрузка новой страницы может включать в себя загрузку множества ресурсов. По этой причине нередко делают _имитацию_ полосы загрузки, положение на которой не связано с истинным прогрессом загрузки.

**Простое вариант**

Вы можете реализовать простой вариант, при котором прогресс достигает 100% равномерно за фиксированное время (напр. 10 сек) используя простой `setInterval`.

**Альтернативный вариант**

Изменение прогресса можно сделать нелинейным, быстрым в начале, но замедляющимся к окончанию, бесконечно стремящееся к некоторому недостижимому значению. Это значение даже может быть менее 100%. А для того, чтобы полоса не "мелькала" при быстрой загрузки, можно запускать её не сразу, а спустя какое-то время загрузки.

- Например, вы можете использовать библиотеку [`Tweenjs`](https://github.com/tweenjs/tween.js) для плавного изменения значения;
- Для плавной анимации можно использовать [`requestAnimationFrame`](https://learn.javascript.ru/js-animation#ispolzovanie-requestanimationframe);
- Документация Vue.js по плавному изменению состояния: [https://vuejs.org/v2/guide/transitioning-state.html](https://vuejs.org/v2/guide/transitioning-state.html).

_В этой задаче не важно, как именно будет работать компонент. Важно, чтобы он предоставлял три описанных выше метода._

## TopProgressBar

Компонент есть. Простой вариант, как мы делали с тостером — всегда работать с его смонтированным экземпляром, вызывая его методы. Это не всегда удобно, так как требует использовать некоторый контейнер, в котором будет храниться экземпляр (например, сам Vue). Лучше инкаспулировать работу с прогресс баром в некотором модуле.

В файле `plugins/TopProgressBar/index.js` создайте модуль, который:
- каким-то образом предоставляет возможность хранения экземпляра компонента `TopProgressBar`;
- экспортирует по умолчанию объект с методами `start`, `finish` и `fail` для взаимодействия с этим экземпляром.

Проще всего сделать такой модуль через **singleton**. Хранить экземпляр прямо в модуле в переменной или в свойстве объекта. Можно предоставить методы для сохранения экземпляра. 

Например:
```javascript
export default {
  // Экземпляр компонента TopProgressBar. Может быть вне объекта.
  instance: null, 

  // Можно добавить метод сохранения экземпляра
  setInstance(instance) {}, 

  // Метод запуска прогресса
  start() { 
    // Взаимодействует с экземпляром компонента
    // (не забывайте о проверках на наличие экземпляра)
    this.instance.start();  
  },
};
```

**singleton** - простое, не самое лучшее решение. Альтернативными решениями могут быть:
- Конструктор экземпляра + его хранение в некотором "глобальном" контейнере, например, в глобальных свойствах Vue;
- Вместо хранения экземпляра взаимодействие с ним через шину событий **EventBus**.

Главное — чтобы модуль экспортировал объект с методами `start`, `finish`, `fail`.

<img src="https://i.imgur.com/K33R4jf.gif" alt="Example" />

## Интеграция с роутером

Можно вручную запускать индикацию загрузки при выполнении операций, но хотелось бы автоматизировать процесс. Например, возможно привязать прогресс к HTTP клиенту, как в [axios модуле для nuxt](https://axios.nuxtjs.org/options#progress), но такое решение зависит от http клиента.

Индикация загрузки в первую очередь нужна при переходе между маршрутами, когда загружаются ресурсы нового маршрута, а также выполняется загрузка данных страницы при [получении данных до перехода](https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-before-navigation).

Предлагается добавить интеграцию индикации загрузки с роутером. Для этого можно использовать [Global guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
1. [Перед каждым переходом](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) требуется запускать прогресс;
2. [После каждого перехода](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-after-hooks) требуется завершать прогресс;
3. [В случае ошибки](https://router.vuejs.org/api/#router-onerror) требуется завершать прогресс с ошибкой.

Внутри `Global guards` работать с **TopProgressBar** можно как раз через созданный в предыдущем пункте модуль.

## Плагин

Осталось добавить плагин для простой установки прогресс бара во Vue приложение.

В модуле `plugins/TopProgressBar/plugin.js` создайте TopProgressBar Vue-плагин:
- Опциональный параметр плагина - `router`, экземпляр VueRouter, с которым интегрирована индикация загрузки;
- При установке плагин должен:
  - Создать новый экземпляр тостера, смонтировать его и сохранять в модуле TopProgressBar;
  - При наличии параметра `router` реализовать интеграцию с роутером;
  - Добавить ссылку на TopProgressBar в прототип Vue в свойство `$progress` для доступа из контекста компонентов для ручного запуска прогресса из компонентов;
  - Добавить ссылку на TopProgressBar в свойство `$progress` Vue для доступа вне компонентов (неявный и из плохих практик, но распространённый подход, альтернатива нашему модулю).

_Для тестирования каждый нечётный митап загружается с ошибкой._

<img src="https://i.imgur.com/1eYPreZ.gif" alt="Example" style="max-width: 100%" />

---

### Инструкция

📝 Для решения задачи отредактируйте файл: `plugins/TopProgressBar/TheTopProgressBar.vue`, `plugins/TopProgressBar/index.js`, `plugins/TopProgressBar/plugin.js`.

🚀 Команда запуска для ручного тестирования: `npm run serve`;<br>
приложение будет доступно на [http://localhost:8080/08-interactions-and-logic-reuse/05-TopProgressBarPlugin](http://localhost:8080/08-interactions-and-logic-reuse/05-TopProgressBarPlugin).

✅ Доступно автоматическое тестирование: `npm test TopProgressBarPlugin`.