import { IProduct } from "../../types";

/**
 * Каталог продуктов.
 */
export class Products {
  private _productsArray: IProduct[] = [];
  private _productSelected: IProduct | undefined = undefined;

  getProductByID(id: string): IProduct | undefined {
    return this._productsArray.find((x) => x.id === id);
  }

  get productsArray(): IProduct[] {
    return this._productsArray;
  }

  set productsArray(value: IProduct[]) {
    this._productsArray = value;
  }

  get productSelected(): IProduct | undefined {
    return this._productSelected;
  }

  set productSelected(value: IProduct) {
    this._productSelected = value;
  }
}
