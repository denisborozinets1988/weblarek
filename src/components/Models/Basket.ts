import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export interface IBasketModel {
  addProduct(product: IProduct): void;
  deleteProduct(id: string): void;
  getTotalCount(): number;
  isProductInProducts(id: string): boolean;
  getTotalAmount(): number;
  clearProducts(): void;
  products: IProduct[];
}

/**
 * Корзина.
 */
export class Basket implements IBasketModel {
  private _products: IProduct[] = [];

  constructor(private _events: IEvents) { }

  /**
   * Добавить продукт в корзину.
   * @param product продукт.
   */
  addProduct(product: IProduct): void {
    this._products.push(product);
    this._events.emit("basket:changed");
  }

  /**
   * Удалить продукт из корзины.
   * @param id идентификатор продукта.
   */
  deleteProduct(id: string): void {
    this._products = this._products.filter((x) => x.id !== id);
    this._events.emit("basket:changed");
  }

  /**
   * Очистить корзину.
   */
  clearProducts(): void {
    this._products = [];
    this._events.emit("basket:changed");
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
