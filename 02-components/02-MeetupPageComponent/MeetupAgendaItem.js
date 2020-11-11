import { agendaItemTitles, agendaItemIcons } from './data.js';

export const MeetupAgendaItem = {
  name: 'MeetupAgendaItem',

  template: `<div class="meetup-agenda__item">
      <div class="meetup-agenda__item-col">
        <img class="icon" alt="icon" :src="finalAgendaItem.icon" />
      </div>
      <div class="meetup-agenda__item-col">{{ finalAgendaItem.startsAt }} - {{ finalAgendaItem.endsAt }}</div>
      <div class="meetup-agenda__item-col">
        <h5 class="meetup-agenda__title">{{ finalAgendaItem.title }}</h5>
        <p>
          <span>{{ finalAgendaItem.speaker }}</span>
          <span class="meetup-agenda__dot" v-if="finalAgendaItem.speaker && finalAgendaItem.language"></span>
          <span class="meetup-agenda__lang">{{ finalAgendaItem.language }}</span>
        </p>
        <p>{{ finalAgendaItem.description }}</p>
      </div>
    </div>`,
  agendaItemTitles,
  agendaItemIcons,
  // props
  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  // Возможно, тут потребуется computed
  computed: {
    finalAgendaItem() {
      return {
        ...this.agendaItem,
        icon: `/assets/icons/icon-${
          agendaItemIcons[`${this.agendaItem.type}`]
        }.svg`,
        title: this.agendaItem.title
          ? this.agendaItem.title
          : agendaItemTitles[`${this.agendaItem.type}`],
      };
    },
  },
};

window.MeetupAgendaItem = MeetupAgendaItem;
