//    Ejercicio 1: Suma de numeros únicos
function sumaUnicos(nums) {
  const numerosValidos = nums.filter(num => Number.isFinite(num));
  const numerosUnicos = new Set(numerosValidos);
  let suma = 0;
  for (let numero of numerosUnicos) {
    suma += numero;
  }
  return suma;
}

// -Ejemplos-
console.log("Ejercicio 1:")
console.log("La suma de numeros únicos es: ", sumaUnicos([2,3,4,3,3,3,20,22,22,22,10]));          
console.log("La suma de numeros únicos es: ", sumaUnicos([1, 2, 2, "Doce", "12", 12, 3, "A"]));  


//    Ejercicio 2: Propiedades
function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

// -Ejemplos-
console.log("\n Ejercicio 2:")
console.log(pick({ a: 1, b: 2, c: 3, d:4, c:5 }, ['a', 'c', 'e', 'A', 'a', 'b'])); 


//    Ejercicio 3: Agrupar lista
function groupBy(list, keyOrFn) {
  return list.reduce((acc, item) => {
    const key = 
      typeof keyOrFn === 'function' 
        ? keyOrFn(item) 
        : item[keyOrFn];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

// -Ejemplos-
console.log("\n Ejercicio 3:")
console.log(groupBy([{t: 'a'}, {t: 'b'}, {t: 'c'}, {t: 'd'}, {t: 'a'}], 't'));
console.log(groupBy([6, 7, 8, 9, 2, 3, 5, 10, 11], n => n % 2 ? 'impar' : 'par'));


//    Ejercicio 4: Ordernar Lista
function sortByMany(list, specs) {
  const copy = [...list];
  copy.sort((a, b) => {
    for (const { key, dir } of specs) {
      const order = dir === 'desc' ? -1 : 1;
      if (a[key] < b[key]) return -1 * order;
      if (a[key] > b[key]) return 1 * order;
    }
    return 0;
  });
  return copy;
}

// -Ejemplos-
const usuarios = [
  { Nombre: 'Javier', Apellido: 'Scarione', Edad: 20 },
  { Nombre: 'Mustafá', Apellido: 'Baissetto', Edad: 23 },
  { Nombre: 'Sebastian', Apellido: 'Diaz', Edad: 21 },
  { Nombre: 'Matias', Apellido: 'Baissetto', Edad: 27 },
];
console.log("\n Ejercicio 4:")
console.log(sortByMany(usuarios, [
  { key: 'Apellido', dir: 'asc' },
  { key: 'Edad', dir: 'desc' }
]));


// Ejercicio 5: Recursividad
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

// -Ejemplos-
console.log("\n Ejercicio 5:")
console.log(deepEqual({ x: [1, 2] }, { x: [1, 2] })); 
console.log(deepEqual({ x: 1 }, { x: '1' }));         
console.log(deepEqual([5, { x: 2 }], [5, { x: 2 }])); 


//    Ejercicio 6: Validar Parentesis
function isBalanced(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const char of s) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char); 
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0; 
}

// -Ejemplos-
console.log("\n Ejercicio 6:")
console.log(isBalanced("(){}")); 
console.log(isBalanced("(]}"));     
console.log(isBalanced("()[{}]")); 


//    Ejercicio 7: Frecuencia de Palabras
function wordFreq(text) {
  const freqMap = new Map();
  const cleanText = text
    .toLowerCase()
    .replace(/[.,:;!?]/g, '');
  const words = cleanText.split(/\s+/).filter(Boolean); 
  for (const word of words) {
    freqMap.set(word, (freqMap.get(word) || 0) + 1);
  }
  return freqMap;
}

// -Ejemplos-
console.log("\n Ejercicio 7:")
console.log(wordFreq("Hola, hola! chau."));
console.log(wordFreq("Probando ejercicio 7, Probando probando"));


//    Ejercicio 8: Orden Superior
function debounce(fn, delay) {
  let timerId; 
  return function(...args) {
    const context = this;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// -Ejemplos-
console.log("\n Ejercicio 9:")
console.log(" Este ejemplo se verá mas adelante como 'Holaa, soy el ejemplo 9' debido a los 500 msg ")
const Imprimir = debounce((msg) => console.log(msg), 500);
Imprimir("Hola, Hola");
Imprimir("Holaa, soy el ejemplo 9");


// Ejercicio 10: Promesas y Control de Tiempo
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

function allSettledLite(promises) {
  return Promise.all(
    promises.map(p =>
      p
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    )
  );
}

// -Ejemplos-
console.log("\n Ejercicio 10:")
const slowPromise = new Promise(resolve => setTimeout(() => resolve("ok"), 2000));
withTimeout(slowPromise, 1000)
  .then(console.log)
  .catch(err => console.log("withTimeout:", err.message));
const ok = () => Promise.resolve("Todo en orden");
const fail = () => Promise.reject("Error");
allSettledLite([ok(), fail()]).then(result => console.log("allSettledLite:", result));





