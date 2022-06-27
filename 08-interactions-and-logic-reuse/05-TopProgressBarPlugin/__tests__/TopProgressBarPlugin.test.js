const { getSolutionPath } = require('taskbook-test-utils');
const TheTopProgressBar = require(getSolutionPath(
  'plugins/TopProgressBar/TheTopProgressBar',
)).default;
const TopProgressBar = require(getSolutionPath('plugins/TopProgressBar'))
  .default;
const TopProgressBarPlugin = require(getSolutionPath(
  'plugins/TopProgressBar/plugin',
)).default;
import { mount } from '@vue/test-utils';

describe('interactions-and-logic-reuse/TopProgressBarPlugin', () => {
  describe('TopProgressBarPlugin', () => {
    it('Задача добавлена, но требует ручной проверки', () => {});

    it('TheTopProgressBar должен иметь методы start, finish и fail', () => {
      const wrapper = mount(TheTopProgressBar);
      expect(wrapper.vm.start).toBeDefined();
      expect(wrapper.vm.finish).toBeDefined();
      expect(wrapper.vm.fail).toBeDefined();
    });

    it('TopProgressBarPlugin должен должен предоставлять методы start, finish и fail', () => {
      expect(TopProgressBar.start).toBeDefined();
      expect(TopProgressBar.finish).toBeDefined();
      expect(TopProgressBar.fail).toBeDefined();
    });

    it('TopProgressBar/plugin должен иметь метод установки', () => {
      expect(TopProgressBarPlugin.install).toBeDefined();
    });

    it('TopProgressBar/plugin должен иметь метод установки', () => {
      expect(TopProgressBarPlugin.install).toBeDefined();
    });
  });
});
