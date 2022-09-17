import { ref } from '../shared/ref.worker.js';

export const count = ref('counter::count', 0);

export const incrementAction = (value = 1) => {
  console.log('!!!!!!! incrementAction', count.value);
  count.value += value;
};

export const incrementLaterAction = (value = 1) => {
  console.log('!!!!!!! incrementLaterAction', count.value);
  setTimeout(() => {
    count.value += value;
  }, 1000);
};
