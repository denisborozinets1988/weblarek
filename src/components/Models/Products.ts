import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export interface IProductsModel {
  productsArray: IProduct[];
  productSelected: IProduct | null;
}

/**
 * Каталог продуктов.
 */
export class Products implements IProductsModel {
  private _productsArray: IProduct[] = [];
  private _productSelected: IProduct | null = null;

  constructor(private _events: IEvents) { }

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
  get productsArray() {
    return this._productsArray;
  }

  /**
   * Установить список всех продуктов.
   */
  set productsArray(value: IProduct[]) {
    this._productsArray = value;
    this._events.emit("catalog:changed");
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
