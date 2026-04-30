import { IBuyer, IErrorsBayer } from "../../types";
import { IEvents } from "../base/Events";
import { ValidationType } from "../presenter/Presenter";

export interface IBuyerModel {
  validateInformation(): IErrorsBayer;
  updateInformation(data: Partial<IBuyer>, validationType?: ValidationType): void;
  getInformation(): IBuyer;
  clearInformation(): void;
}

export interface IBuyerTypeUpdate {
  typeUpdate: ValidationType;
}

/**
 * Покупатель.
 */
export class Buyer {

  constructor(private _events: IEvents) { }

  private _data: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };

  /**
   * Обновить информацию о покупателе.
   * @param data данные для обновления.
   */
  updateInformation(data: Partial<IBuyer>, validationType?: ValidationType): void {
    this._data = { ...this._data, ...data };
    this._events.emit("order:update", { typeUpdate: validationType } as IBuyerTypeUpdate);
  }

  /**
   * Получить информацию о покупателе.
   * @returns Map с информацией о пользователе.
   */
  getInformation(): IBuyer {
    return this._data;
  }

  /**
   * Валидация информации о покупателе.
   * @returns объект с проблемными полями.
   */
  validateInformation(): IErrorsBayer {
    const result: IErrorsBayer = {};

    if (!this._data.payment) {
      result.payment = "Не заполнен тип платежа.";
    }

    if (!this._data.email) {
      result.email = "Не заполнена электронная почта.";
    }

    if (!this._data.phone) {
      result.phone = "Не заполнен номер телефона.";
    }

    if (!this._data.address) {
      result.address = "Не заполнен адрес.";
    }

    return result;
  }

  /**
   * Очистить информацию о покупателе.
   */
  clearInformation(): void {
    this._data = {
      address: "",
      email: "",
      payment: null,
      phone: "",
    };
    this._events.emit("order:update", { typeUpdate: ValidationType.All } as IBuyerTypeUpdate);
  }
}