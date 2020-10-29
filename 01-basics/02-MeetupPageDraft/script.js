import Vue from './vue.esm.browser.js';

/** URL адрес API */
const API_URL = 'https://course-vue.javascript.ru/api';

/** ID митапа для примера; используйте его при получении митапа */
const MEETUP_ID = 6;

/**
 * Возвращает ссылку на изображение митапа для митапа
 * @param meetup - объект с описанием митапа (и параметром meetupId)
 * @return {string} - ссылка на изображение митапа
 */
function getMeetupCoverLink(meetup) {
  return `${API_URL}/images/${meetup.imageId}`;
}

function getDateOnlyString(date) {
  const YYYY = date.getFullYear();
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const DD = date.getDate().toString().padStart(2, '0');
  return `${YYYY}-${MM}-${DD}`;
}

/**
 * Словарь заголовков по умолчанию для всех типов элементов программы
 */
const agendaItemTitles = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

/**
 * Словарь иконок для для всех типов элементов программы.
 * Соответствует имени иконок в директории /assets/icons
 */
const agendaItemIcons = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

export const app = new Vue({
  el: '#app',

  data: {
    //
    rawMeetup: null,
    agendaTitles: agendaItemTitles,
    agendaIcons: agendaItemIcons,
  },

  mounted() {
    // Требуется получить данные митапа с API
    this.getMeetup();
  },

  computed: {
    //
    meetup() {
      if (!this.rawMeetup) {
        return null;
      }
      return {
        ...this.rawMeetup,
        date: new Date(this.rawMeetup.date),
        localDate: new Date(this.rawMeetup.date).toLocaleString(
          navigator.language,
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        ),
        dateOnlyString: getDateOnlyString(new Date(this.rawMeetup.date)),
        cover: this.rawMeetup.imageId
          ? getMeetupCoverLink(this.rawMeetup)
          : undefined,
        agenda: this.rawMeetup.agenda.map((agenda) => ({
          ...agenda,
          title: agenda.title
            ? agenda.title
            : this.agendaTitles[`${agenda.type}`],
          icon: this.agendaIcons[`${agenda.type}`],
        })),
      };
    },
  },

  methods: {
    // Получение данных с API предпочтительнее оформить отдельным методом,
    // а не писать прямо в mounted()
    async getMeetup() {
      let response = await fetch(`${API_URL}/meetups/${MEETUP_ID}`);
      this.rawMeetup = await response.json();
    },
  },
});
