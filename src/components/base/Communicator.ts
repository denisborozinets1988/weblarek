import {
  IApi,
  IOrder,
  IOrderResponse,
  IProduct,
  IProductsResponse,
} from "../../types";
import { API_URL } from "../../utils/constants";

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
