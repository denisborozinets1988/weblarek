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
   * @param id идентификатор продукта.
   */
  deleteProduct(id: string): void {
    this._products = this._products.filter((x) => x.id !== id);
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
        acc.price += item.price ?? 0;
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
   * @param id идентификатор продукта, который проверяем.
   * @returns true если продукт есть в корзине, иначе false.
   */
  isProductInProducts(id: string): boolean {
    return this._products.some((x) => x.id === id);
  }

  /**
   * Получить список продуктов в корзине.
   */
  get products(): IProduct[] {
    return this._products;
  }
}
