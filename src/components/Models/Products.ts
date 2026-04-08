import { IProduct } from "../../types";

/**
 * Каталог продуктов.
 */
export class Products {
  private _productsArray: IProduct[] = [];
  private _productSelected: IProduct | null = null;

  /**
   * Получить продукт по идентификатору.
   * @param id идентификатор продукта.
   * @returns если нашли то продукт, иначе undefined.
   */
  getProductByID(id: string): IProduct | undefined {
    return this._productsArray.find((x) => x.id === id);
  }

  /**
   * Получить список всех продуктов.
   */
  get productsArray(): IProduct[] {
    return this._productsArray;
  }

  /**
   * Установить список всех продуктов.
   */
  set productsArray(value: IProduct[]) {
    this._productsArray = value;
  }

  /**
   * Получить выбранный продукт.
   */
  get productSelected(): IProduct | null {
    return this._productSelected;
  }

  /**
   * Установить выбранный рподукт.
   */
  set productSelected(value: IProduct) {
    this._productSelected = value;
  }
}
