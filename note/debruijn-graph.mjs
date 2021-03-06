
// import findCycle from 'find-cycle/directed'
import hamiltonianCycle from 'javascript-algorithms-and-data-structures/src/algorithms/graph/hamiltonian-cycle/hamiltonianCycle.js'
import Graph from 'javascript-algorithms-and-data-structures/src/data-structures/graph/Graph.js'
import GraphVertex from 'javascript-algorithms-and-data-structures/src/data-structures/graph/GraphVertex.js'
import GraphEdge from 'javascript-algorithms-and-data-structures/src/data-structures/graph/GraphEdge.js'
import fs from 'fs'

// http://web.mnstate.edu/goytadam/talks/DBS.pdf
const SIZE = 6

const vertices = getEveryBitPermutation(SIZE).reduce((m, x) => {
  m[x.toString(2).padStart(SIZE, 0)] = new Array
  return m
}, {})

Object.keys(vertices).forEach(v => {
  Object.keys(vertices).forEach(v2 => {
    if (v != v2 && isWired(v, v2)) {
      if (!vertices[v].includes(v2))
        vertices[v].push(v2)
    }
  })
  // const l = rol(parseInt(v, 2), SIZE).toString(2).padStart(SIZE, 0)
  // const r = ror(parseInt(v, 2), SIZE).toString(2).padStart(SIZE, 0)

  // if (!vertices[v].includes(l))
  //   vertices[v].push(l)

  // if (!vertices[v].includes(r))
  //   vertices[v].push(r)
})

function isWired(a, b) {
  let a_end = a.split('')
  a_end.shift()
  a_end = a_end.join('')
  let b_start = b.split('')
  b_start.pop()
  b_start = b_start.join('')
  return a_end === b_start
}

let i = 1
let results = []
for (let string of collectStrings(vertices)) {
  // if (isDeBruijnSequence(string, SIZE))
    console.log(String(i++).padStart(4, ' '),
      isDeBruijnSequence(string, SIZE) ? '!' :' ',
      string,
      parseInt(string, 2).toString(16)
    )
  results.push(string)
}

fs.writeFileSync('note/debruijn.graph.csv', results.join('\n'))

function *collectStrings(vertices) {
  const visited = new Uint32Array(2 ** SIZE)
  let j = 0
  for (const v in vertices) {
    // zero
    for (let i = 0, n = visited.length; i < n; i++) {
      visited[i] = 0
    }
    const strings = dfs(j++, v, vertices, visited, 1)
    for (let string of strings) {
      if (string) yield string
    }
  }
}

function dfs(i, start, vertices, visited, dir, results = []) {
  const graph = new Graph(true)
  graph.addVertex(new GraphVertex(start))
  Object.keys(vertices).forEach(v => {
    const vertex = new GraphVertex(v)
    try {
      graph.addVertex(vertex)
    } catch (e) {}
  })
  Object.keys(vertices).forEach(v => {
    const vertex = graph.getVertexByKey(v)
    vertices[v].forEach(e => {
      graph.addEdge(new GraphEdge(vertex, graph.getVertexByKey(e)))
    })
    try {
      graph.addEdge(new GraphEdge(vertex, graph.getVertexByKey(start)))
    } catch (e) {}
  })
  console.log('computing...')
  const cycle = hamiltonianCycle(graph)

  while (cycle.length) {
    const vertexes = cycle.pop()
    const key = []
    vertexes.forEach(vert => {
      key.push(vert.value[vert.value.length - 1])
    })
    results.push(key.join(''))
  }

  return results
}

function getEveryBitPermutation(size) {
  let start = 0
  let end = 2 ** size
  const set = new Uint32Array(end - start)
  let i = 0
  while (start < end) {
    set[i++] = start++
  }
  return set
}

function isDeBruijnSequence(string, spanSizeInBits) {
  let bits = string.split('').reverse()
  let i = 0
  const totalElementSize = 2 ** spanSizeInBits
  const chunksVisited = new Uint8ClampedArray(totalElementSize)
  while (i < bits.length) {
    const chunk = bits.slice(i, i + spanSizeInBits)
    if (chunk.length < spanSizeInBits) {
      const diff = bits.slice(0, spanSizeInBits - chunk.length)
      chunk.push(...diff)
    }
    const string = chunk.reverse().join('')
    const number = parseInt(string, 2)
    if (chunksVisited[number] == 1) {
      return false
    }
    chunksVisited[number] = 1
    i++
  }
  return true
}

function rol(n, size) {
  const bits = n.toString(2).padStart(size, 0).split('').reverse()
  const left = bits.pop()
  bits.unshift(left)
  const string = bits.reverse().join('')
  const number = parseInt(string, 2)
  return number
}

function ror(n, size) {
  const bits = n.toString(2).padStart(size, 0).split('').reverse()
  const right = bits.shift()
  bits.push(right)
  const string = bits.reverse().join('')
  const number = parseInt(string, 2)
  return number
}

// https://people.engr.ncsu.edu/savage/AVAILABLE_FOR_MAILING/necklace_fkm.pdf


// The shift register  is clocked at a time interval, when this happens the contents of  are shifted one bit
// to the left (i.e., the content of 1 is transferred into 1%*
// (230 45 +6 0 and the new content of '(
//  is
// computed by applying the feedback function  to the old contents of .    
