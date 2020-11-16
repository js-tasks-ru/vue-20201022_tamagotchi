import { MeetupAgendaItem } from './MeetupAgendaItem.js';

export const MeetupAgenda = {
  name: 'MeetupAgenda',

  template: `
    <div class="meetup-agenda">
      <meetup-agenda-item v-for="(agendaItem,index) in agenda" :agenda-item="agenda[index]" :key="index"/>
    </div>`,

  // components
  components: {
    MeetupAgendaItem,
  },
  // props
  props: {
    agenda: {
      type: Array,
      required: true,
    },
  },
};
