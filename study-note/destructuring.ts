// destructuring 문법 (ES6)

const obj = {
  a: 10,
  b: 20,
  c: 30,
};
const { a, b, c } = obj;

/* 예시 */
function fatchData() {
  return {
    data: {
      id: "typescript",
      when: 2022,
    },
    config: {},
    statusText: "",
    headers: {},
  };
}

const { data } = fatchData();
console.log("## data > ", data); // {id: "typescript", when: 2022}

const { data: result } = fatchData();
console.log("## result > ", result); // {id: "typescript", when: 2022}
