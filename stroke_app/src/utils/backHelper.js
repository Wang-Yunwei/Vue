const list = []

function push(fn) {
  list.push(fn)
}

function pop() {
  list.pop()
}

function run() {
  if (list.length > 0) {
    const fn = list.pop()
    fn()
  }
}

export default {
  push,
  pop,
  run
}
