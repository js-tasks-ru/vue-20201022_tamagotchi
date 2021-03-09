import flushPromises from 'flush-promises';

const { shallowMount } = require('@vue/test-utils');
const { getSolutionPath } = require('taskbook-test-utils');
const { ImageService } = require(getSolutionPath('image-service'));
const ImageUploader = require(getSolutionPath('components/ImageUploader.vue'))
  .default;

const mockID = 123;
jest.mock('../image-service');
jest.spyOn(ImageService, 'uploadImage').mockResolvedValue({ id: mockID });
jest.spyOn(ImageService, 'getImageURL').mockImplementation((id) => id);

describe('deep-vue/ImageUploader', () => {
  describe('ImageUploader', () => {
    jest.useFakeTimers();

    let wrapper;
    let input;
    let label;
    let value = '';
    let getFiles;

    beforeEach(() => {
      wrapper = shallowMount(ImageUploader);
      input = wrapper.find('input');
      label = wrapper.find('label');

      getFiles = jest.fn();
      Object.defineProperty(input.element, 'files', {
        get: getFiles,
        set: jest.fn(),
      });

      Object.defineProperty(input.element, 'value', {
        get: () => value,
        set: (newValue) => {
          value = newValue;
        },
      });
    });

    it('ImageUploader должен иметь параметр imageId со значением null по умолчанию', async () => {
      expect(wrapper.vm.$options.props.imageId).toBeTruthy();
      expect(wrapper.vm.$options.props.imageId.default).toBe(null);
    });

    it('ImageUploader должен иметь текст "Загрузить изображение", когда он пуст', async () => {
      expect(label.text()).toBe('Загрузить изображение');
    });

    it('ImageUploader должен переходить в состояние загрузки, выводить "Загрузка..." после выбора изображения на время загрузки', async () => {
      value = '/fake_path/image.png';
      getFiles.mockReturnValue([new File([], 'image.png')]);

      await input.trigger('change');
      expect(label.text()).toBe('Загрузка...');

      await flushPromises();
      await wrapper.vm.$nextTick();
      await wrapper.setProps({ imageId: mockID });

      expect(label.text()).not.toBe('Загрузка...');
    });

    it('ImageUploader должен порождать событие change с ID изображения после загрузки изображения', async () => {
      value = '/fake_path/image.png';
      getFiles.mockReturnValue([new File([], 'image.png')]);

      await input.trigger('change');
      await flushPromises();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted().change).toHaveLength(1);
      expect(wrapper.emitted().change[0]).toEqual([mockID]);
    });

    it('ImageUploader должен загружать файл через ImageService.uploadImage', async () => {
      value = '/fake_path/image.png';
      getFiles.mockReturnValue([new File([], 'image.png')]);

      await input.trigger('change');
      await flushPromises();
      await wrapper.vm.$nextTick();
      expect(ImageService.uploadImage.mock.calls[0][0]).toBeInstanceOf(File);
    });

    it('ImageUploader должен иметь текст "Удалить изображение", когда изображение выбрано, и выводить его через --bg-image', async () => {
      await wrapper.setProps({ imageId: mockID });
      expect(label.text()).toBe('Удалить изображение');
      expect(
        getComputedStyle(label.element).getPropertyValue('--bg-image'),
      ).toContain(mockID);
    });

    it('ImageUploader должен сбрасывать изображение, при клике на "Удалить изображение"', async () => {
      value = '/fake_path/image.png';
      getFiles.mockReturnValue([new File([], 'image.png')]);
      await wrapper.setProps({ imageId: mockID });
      await label.trigger('click');
      expect(wrapper.emitted().change).toHaveLength(1);
      expect(wrapper.emitted().change[0]).toEqual([null]);

      await wrapper.setProps({ imageId: null });
      expect(label.text()).toBe('Загрузить изображение');
      expect(label.attributes().style).toBeFalsy();
      expect(value).toBeFalsy();
    });
  });
});
