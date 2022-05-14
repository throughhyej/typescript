/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * ex: Interface Item의 모든 값을 필요로 하지 않는다.
 * 불필요한 interface, type 정의를 줄일 수 있다.
 *
 * 1. Pick<>
 * 2. Partial<>
 * 3. Omit<>
 * … https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

interface Item {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}
/* 1. Pick<>: 특정 인터페이스에서 지정한 항목만 사용 */
const pickDetailInfo: Pick<Item, "id" | "name" | "price"> = {
  id: 1,
  name: "name1",
  price: 100,
};
/* 2. Partial<>: 특정 인터페이스에서 지정하고 사용하고 싶은 항목 사용 (모든 항목이 ?가 됨) */
const partialDetailInfo: Partial<Item> = {
  id: 2,
  name: "name2",
  price: 200,
  stock: 0,
};
/* 3. Omit<>: 특정 인터페이스에서 지정한 항목만 제거 */
const omitDetailInfo: Omit<Item, "id" | "name"> = {
  price: 300,
  brand: "shop",
  stock: 10,
};
