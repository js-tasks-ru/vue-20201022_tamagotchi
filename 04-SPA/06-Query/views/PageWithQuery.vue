<template>
  <div class="container">
    <meetups-view
      :view.sync="view"
      :date.sync="date"
      :participation.sync="participation"
      :search.sync="search"
    />
  </div>
</template>

<script>
import MeetupsView from '../components/MeetupsView';

export default {
  name: 'PageWithQuery',
  components: { MeetupsView },
  data() {
    return {
      view: this.$route.query.view,
      date: this.$route.query.date,
      participation: this.$route.query.participation,
      search: this.$route.query.search,
    };
  },
  watch: {
    view: function () {
      this.addQuery();
    },
    date: function () {
      this.addQuery();
    },
    participation: function () {
      this.addQuery();
    },
    search: function () {
      this.addQuery();
    },
    '$route.query': function (newQueries) {
      this.view = newQueries.view;
      this.date = newQueries.date;
      this.participation = newQueries.participation;
      this.search = newQueries.search;
    },
  },
  methods: {
    addQuery() {
      let queries = {
        view: this.view,
        date: this.date,
        participation: this.participation,
        search: this.search,
      };
      if (queries.view === 'list') {
        delete queries.view;
      }
      if (queries.date === 'all') {
        delete queries.date;
      }
      if (queries.participation === 'all') {
        delete queries.participation;
      }
      if (!queries.search) {
        delete queries.search;
      }
      return this.$router.push({ query: queries });
    },
  },
};
</script>

<style scoped></style>
