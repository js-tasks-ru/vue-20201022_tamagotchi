const { shallowMount } = require('@vue/test-utils');
const { getSolutionPath } = require('taskbook-test-utils');
const AppCheckbox = require(getSolutionPath('components/AppCheckbox.vue'))
  .default;

describe('deep-vue/AppCheckbox', () => {
  describe('AppCheckbox', () => {
    const slots = { default: '<span>Default Slot</span>' };
    const value = 'Value';

    it('AppCheckbox должен рендерить слот', () => {
      const wrapper = shallowMount(AppCheckbox, { slots });
      expect(wrapper.html()).toContain(slots.default);
    });

    it('AppCheckbox должен обрабатывать нативные события (focus)', async () => {
      const handler = jest.fn();
      const wrapper = shallowMount(AppCheckbox, {
        listeners: {
          focus: ($event) => handler($event),
        },
      });
      await wrapper.find('input').trigger('focus');
      expect(handler).toHaveBeenCalled();
    });

    it('AppCheckbox атрибуты должны наследоваться на input', async () => {
      const attrs = { disabled: 'disabled', value };
      const wrapper = shallowMount(AppCheckbox, { attrs });
      expect(wrapper.find('input').attributes()).toMatchObject(attrs);
      expect(wrapper.attributes()).not.toMatchObject(attrs);
    });

    it('AppCheckbox должен отображать состояние, соответствующее логическому checked', async () => {
      const wrapper = shallowMount(AppCheckbox);
      const input = wrapper.find('input');
      expect(input.element.checked).toBe(false);
      await wrapper.setProps({ checked: true });
      expect(input.element.checked).toBe(true);
    });

    it('AppCheckbox должен отображать состояние в соответствии со списком в checked', async () => {
      const array = [];
      const wrapper = shallowMount(AppCheckbox, {
        attrs: { value },
      });
      await wrapper.setProps({ checked: array });
      const input = wrapper.find('input');
      expect(input.element.checked).toBe(false);
      array.push(value);
      await wrapper.vm.$nextTick();
      expect(input.element.checked).toBe(true);
    });

    it('AppCheckbox должен порождать событие change с новым значением bool checked при изменении значения checkbox', async () => {
      const wrapper = shallowMount(AppCheckbox);
      await wrapper.setProps({ checked: false });
      await wrapper.find('input').setChecked(true);
      expect(wrapper.emitted()['change']).toBeTruthy();
      expect(wrapper.emitted()['change'][0]).toEqual([true]);
    });

    it('AppCheckbox должен порождать событие change с массивом значений выбранных значений при изменении значения checkbox', async () => {
      const array = [];
      const wrapper = shallowMount(AppCheckbox, {
        attrs: { value },
      });
      await wrapper.setProps({ checked: array });
      await wrapper.find('input').setChecked(true);
      expect(wrapper.emitted()['change']).toBeTruthy();
      expect(wrapper.emitted()['change']).toHaveLength(1);
      expect(wrapper.emitted()['change'][0]).toHaveLength(1);
      expect(wrapper.emitted()['change'][0][0]).toEqual([value]);
    });
  });
});
