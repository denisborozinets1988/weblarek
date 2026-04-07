import { IApi, IOrderResponse, IProduct, IProductsResponse } from "../../types";

/**
 * Класс для отправки get/post запросов в API.
 */
export class Communicator {
  private _api: IApi;
  constructor(api: IApi) {
    this._api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this._api
      .get<IProductsResponse>("/product/")
      .then((data) => data.items);
  }

  postOrder(order: object): Promise<IOrderResponse> {
    return this._api.post<IOrderResponse>("/order", order);
  }
}
