import { IProduct } from "../../types";

/**
 * Корзина.
 */
export class Basket {
  private _products: IProduct[] = [];

  /**
   * Добавить продукт в корзину.
   * @param product продукт.
   */
  addProduct(product: IProduct): void {
    this._products.push(product);
  }

  /**
   * Удалить продукт из корзины.
   * @param product продукт.
   */
  deleteProduct(product: IProduct): void {
    for (let i = this._products.length; i >= 0; i--) {
      if (this._products[i] === product) {
        this._products.splice(i, 1);
      }
    }
  }

  /**
   * Очистить корзину.
   */
  clearProducts(): void {
    this._products = [];
  }

  /**
   * Получить общую сумму по полю price.
   * @returns сумма по полю price.
   */
  getTotalAmount(): number {
    return this._products.reduce(
      (acc, item) => {
        acc.price += item.price === null ? 0 : item.price;
        return acc;
      },
      { price: 0 },
    ).price;
  }

  /**
   * Получить общее количество товаров в корзине.
   * @returns сколько продуктов в корзине.
   */
  getTotalCount(): number {
    return this._products.length;
  }

  /**
   * Проверка что продукт находится в корзине.
   * @param product продукт, который проверяем.
   * @returns true если продукт есть в корзине, иначе false.
   */
  productInProducts(product: IProduct): boolean {
    return this._products.find((x) => x === product) !== undefined;
  }

  /**
   * Получить список продуктов в корзине.
   */
  get products(): IProduct[] {
    return this._products;
  }
}
