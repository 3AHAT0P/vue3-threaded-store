const ref = (key, initialValue) => {
  let _value = initialValue
  return {
    get value() {
      return _value
    },
    set value(newValue) {
      _value = newValue
      postMessage({ op: 'SET', key, value: _value })
    },
    sync(newValue) {
      _value = newValue
    },
  }
}

const cache = {}

onmessage = e => {
  const { op, key, value } = e.data
  console.log('MESSAGE IN WORKER', e.data)
  if (op === 'GET') {
    if (!(key in cache)) {
      cache[key] = ref(key, value)
    }
    postMessage({ op: 'SET', key, value: cache[key].value })
  } else if (op === 'SET') {
    if (!(key in cache)) {
      cache[key] = ref(key, value)
    } else cache[key].sync(value)
  }
}
