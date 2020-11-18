<template>
  <div>
    <button type="button" @click="addCounter">{{ count }}</button>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'count',
    event: 'increment',
  },
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    addCounter() {
      this.$emit('increment', this.count + 1);
    },
  },
};
</script>

<style></style>
