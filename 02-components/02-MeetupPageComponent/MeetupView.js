import { MeetupCover } from './MeetupCover.js';
import { MeetupDescription } from './MeetupDescription.js';
import { MeetupAgenda } from './MeetupAgenda.js';
import { MeetupInfo } from './MeetupInfo.js';
import { getMeetupCoverLink } from './data.js';

export const MeetupView = {
  name: 'MeetupView',

  template: `
    <div>
      <!-- meetup cover -->
      <meetup-cover :link="UpgradedMeetup.cover" :title="UpgradedMeetup.title"/>
      <div class="container">
        <div class="meetup">
          <div class="meetup__content">
            <h3>Описание</h3>
            <!-- meetup description -->
            <meetup-description :description="UpgradedMeetup.description"/>
            <h3>Программа</h3>
            <!-- meetup agenda -->
            <meetup-agenda :agenda="UpgradedMeetup.agenda"/>
          </div>
          <div class="meetup__aside">
            <!-- meetup info -->
            <meetup-info :organizer="UpgradedMeetup.organizer" :place="UpgradedMeetup.place" :date="UpgradedMeetup.date"/>
          </div>
        </div>
      </div>
    </div>`,
  // components
  components: {
    MeetupCover,
    MeetupDescription,
    MeetupAgenda,
    MeetupInfo,
  },

  // props
  props: {
    meetup: {
      type: Object,
      required: true,
    },
  },
  computed: {
    UpgradedMeetup() {
      return {
        ...this.meetup,
        cover: getMeetupCoverLink(this.meetup),
        date: new Date(this.meetup.date),
      };
    },
  },
};
