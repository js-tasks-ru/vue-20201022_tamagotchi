export const CounterButton = {
  // Шаблон потребуется отредактировать
  template: `<button type="button"  @click="addCounter(count)">{{ count }}</button>`,

  // Компонент должен иметь входной параметр

  // Компонент должен иметь модель

  // Шаблон лучше держать максимально простым, а логику выносить в методы
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
    addCounter(count) {
      this.$emit('increment', count + 1);
    },
  },
};
