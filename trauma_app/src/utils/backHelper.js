const list = []

function push(fn) {
  list.push(fn)
}

function pop() {
  list.pop()
}

function run() {
  console.log('run', list)
  if (list.length > 0) {
    const fn = list[list.length - 1]
    fn()
  }
}

export default {
  push,
  pop,
  run
}
