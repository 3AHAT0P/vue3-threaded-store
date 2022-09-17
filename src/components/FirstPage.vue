<script setup>
import { ref } from 'vue';
import { useWorkerRef, useWorkerAction } from '@/store/shared/bridge.main.js';

defineProps({
  msg: String,
});

const count = useWorkerRef('count', 0);

const counterCount = useWorkerRef('counter::count', 0);
const incrementAction = useWorkerAction('incrementAction');
const incrementLaterAction = useWorkerAction('incrementLaterAction');

const wUpdate = () => {
  count.sync(count.value + 5);
  console.log('qweqwe');
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <span>count is {{ count }}</span>
    <br />
    <button type="button" @click="count++">Update ref by increment</button>
    <button type="button" @click="wUpdate">update just local</button>
    <br />
    <br />

    <span>counterCount is {{ counterCount }}</span>
    <br />
    <button type="button" @click="counterCount++">
      Update ref by increment
    </button>
    <button type="button" @click="incrementAction()">update by action</button>
    <button type="button" @click="incrementLaterAction(11)">
      update by async action
    </button>
    <p>
      Edit
      <code>components/FirstPage.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
