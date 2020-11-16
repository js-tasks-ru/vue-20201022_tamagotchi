import { MeetupView } from './MeetupView.js';
import { MEETUP_ID, fetchMeetup } from './data.js';

export const MeetupPage = {
  name: 'MeetupPage',

  template: `<div>
    <meetup-view :meetup="meetup" v-if="meetup"/>
  </div>`,

  // components
  components: {
    MeetupView,
  },

  // data
  data() {
    return {
      meetup: null,
    };
  },

  // mounted
  mounted() {
    this.getMeetup();
  },

  // methods
  methods: {
    async getMeetup() {
      fetchMeetup(MEETUP_ID).then((result) => {
        this.meetup = result;
      });
    },
  },
};
