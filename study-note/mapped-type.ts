/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * 기존 타입을 변경해줄 수 있다.
 *
 * https://joshua1988.github.io/ts/usage/mapped-type.html#맵드-타입-mapped-type-이란
 */

type product = "item1" | "item2" | "item3";

type stocks = { [k in product]: number };

const stockInfo = {
  item1: 1,
  item2: 4,
  item3: 3,
};
