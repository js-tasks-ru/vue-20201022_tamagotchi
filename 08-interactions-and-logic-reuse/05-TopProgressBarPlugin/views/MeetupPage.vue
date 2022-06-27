<template>
  <div class="container">
    <h1>Meetup Page {{ meetupId }}</h1>
    <template v-if="meetup">
      <h3>{{ meetup.title }}</h3>
      <router-view :meetup="meetup" />
    </template>
    <template v-else>
      <h3>Loading...</h3>
    </template>
  </div>
</template>

<script>
import { fetchMeetup } from '../data';

export default {
  name: 'MeetupPage',

  props: {
    meetupId: {
      type: [String, Number],
      required: true,
    },
  },

  beforeRouteEnter(to, from, next) {
    if (+to.params.meetupId % 2) {
      throw new Error('Ooops');
    }
    fetchMeetup(+to.params.meetupId)
      .then((meetup) => {
        next((vm) => {
          vm.setMeetup(meetup);
        });
      })
      .catch((error) => {
        next(error);
      });
  },

  beforeRouteUpdate(to, from, next) {
    if (to.params.meetupId === from.params.meetupId) {
      next();
    } else {
      fetchMeetup(+to.params.meetupId)
        .then((meetup) => {
          next((vm) => {
            vm.setMeetup(meetup);
          });
        })
        .catch((error) => {
          next(error);
        });
    }
  },

  data() {
    return {
      meetup: null,
    };
  },

  methods: {
    setMeetup(meetup) {
      this.meetup = meetup;
    },
  },
};
</script>

<style scoped></style>
