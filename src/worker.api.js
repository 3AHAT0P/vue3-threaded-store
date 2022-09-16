import { customRef } from '@vue/reactivity'

import MyWorker from './worker.js?worker'

let _worker
let _cache = {}

export const initWorker = () => {
  _worker = new MyWorker()

  _worker.onmessage = e => {
    const { op, key, value } = e.data
    console.log('MESSAGE IN UI THREAD', e.data)
    if (op === 'SET') {
      if (key in _cache) {
        _cache[key].sync(value)
      } else {
        console.log('Do nothing!?')
      }
    }
  }
}

export function useWorkerRef(key, value) {
  if (key in _cache) return _cache[key]

  let isSynced = false
  const ref = customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        if (!isSynced) {
          _worker.postMessage({ op: 'SET', key, value })
        }
        isSynced = false
        value = newValue
        trigger()
      },
    }
  })
  ref.sync = newValue => {
    isSynced = true
    ref.value = newValue
  }

  _cache[key] = ref
  _worker.postMessage({ op: 'GET', key, value })

  return ref
}
