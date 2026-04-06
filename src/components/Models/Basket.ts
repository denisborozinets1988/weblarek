import { IProduct } from "../../types";

/**
 * Корзина.
 */
export class Basket {
  private _products: IProduct[] = [];

  addProduct(product: IProduct): void {
    this._products.push(product);
  }

  deleteProduct(product: IProduct): void {
    for (let i = this._products.length; i >= 0; i--) {
      if (this._products[i] === product) {
        this._products.splice(i, 1);
      }
    }
  }

  clearProducts(): void {
    this._products = [];
  }

  getTotalAmount(): number {
    return this._products.reduce(
      (acc, item) => {
        acc.price += item.price === null ? 0 : item.price;
        return acc;
      },
      { price: 0 },
    ).price;
  }

  getTotalCount(): number {
    return this._products.length;
  }

  productInProducts(product: IProduct): boolean {
    return this._products.find((x) => x === product) !== undefined;
  }

  get products(): IProduct[] {
    return this._products;
  }
}
