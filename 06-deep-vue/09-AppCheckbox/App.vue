<template>
  <div id="app" class="page container">
    <p>
      <app-checkbox v-model="checked"> Checked ({{ checked }})</app-checkbox>
    </p>
    <p><app-checkbox v-model="checkedArray" value="A">Check A</app-checkbox></p>
    <p><app-checkbox v-model="checkedArray" value="B">Check B</app-checkbox></p>
    <p><app-checkbox v-model="checkedArray" value="C">Check C</app-checkbox></p>
    <p>Checked: {{ checkedArray }}</p>
    <p>
      <button @click="checked = !checked">
        Update Bool
      </button>
    </p>
    <p>
      <button
        @click="
          !checkedArray.includes('A')
            ? checkedArray.push('A')
            : checkedArray.pop()
        "
      >
        Update Array
      </button>
    </p>
  </div>
</template>

<script>
import AppCheckbox from './components/AppCheckbox';

export default {
  name: 'App',
  components: { AppCheckbox },

  data() {
    return {
      checked: false,
      checkedArray: [],
    };
  },
};
</script>

<style>
p {
  margin: 1rem auto;
}
</style>
