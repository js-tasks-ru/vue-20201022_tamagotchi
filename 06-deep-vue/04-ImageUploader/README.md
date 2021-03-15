# ImageUploader

Основная задача - загрузка изображения.

Для получения изображения требуется обработать событие `@change` у поля ввода. Файл с выбранным изображением можно найти в `$event.target.files[0]`.

Файл с изображением также можно получить в любой момент времени, если установить `ref` на `input`.

Ещё одна проблема может быть, если при удалении изображения не сбрасывать значения поля ввода. В этом случае не получится повторно выбрать тот же файл, так как не сработает событие `change`. Для удаления выбранного изображения можно, например, установить пустую строку или `null` в качестве значения. При клике на "Удалить изображение" важно также вызывать `$event.preventDefault();`, чтобы не открыть диалог выбора файла.

```html
<template>
  <div class="image-uploader">
    <label
      class="image-uploader__preview"
      :class="{ 'image-uploader__preview-loading': loading }"
      :style="imageURL ? `--bg-image: url('${imageURL}')` : ''"
    >
      <span v-if="state === $options.states.loading">Загрузка...</span>
      <span v-else-if="state === $options.states.filled"
      >Удалить изображение</span
      >
      <span v-else-if="state === $options.states.empty"
      >Загрузить изображение</span
      >
      <input
        type="file"
        accept="image/*"
        class="form-control-file"
        ref="fileInput"
        @change="handleFileSelected"
        @click="handleClick"
      />
    </label>
  </div>
</template>

<script>
  import { ImageService } from '../image-service';

  export default {
    name: 'ImageUploader',

    states: {
      loading: 'loading',
      filled: 'filled',
      empty: 'empty',
    },

    props: {
      imageId: {
        default: null,
      },
    },

    model: {
      prop: 'imageId',
      event: 'change',
    },

    data() {
      return {
        loading: false,
      };
    },

    computed: {
      state() {
        if (this.loading) {
          return this.$options.states.loading;
        } else if (this.imageId !== null) {
          return this.$options.states.filled;
        } else {
          return this.$options.states.empty;
        }
      },

      imageURL() {
        return this.imageId ? ImageService.getImageURL(this.imageId) : null;
      },
    },

    methods: {
      handleFileSelected($event) {
        this.loading = true;
        return ImageService.uploadImage($event.target.files[0])
          .then((result) => {
            this.$emit('change', result.id);
          })
          .catch(() => {
            // Здесь может быть обработка ошибок, например, вывод тоста
          })
          .finally(() => {
            this.loading = false;
          });
      },

      handleClick($event) {
        if (this.state === this.$options.states.loading) {
          $event.preventDefault();
        } else if (this.state === this.$options.states.filled) {
          $event.preventDefault();
          this.resetFile();
        }
      },

      resetFile() {
        this.$refs.fileInput.value = '';
        this.$emit('change', null);
      },
    },
  };
</script>
```
