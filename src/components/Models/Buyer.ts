import { IBuyer, IErrorsBayer } from "../../types";

/**
 * Покупатель.
 */
export class Buyer {
  private _data: IBuyer = {
    payment: "",
    email: "",
    phone: "",
    address: "",
  };

  /**
   * Обновить информацию о покупателе.
   * @param data данные для обновления.
   */
  updateInformation(data: Partial<IBuyer>): void {
    this._data = { ...this._data, ...data };
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
    const result: {
      payment?: string;
      email?: string;
      phone?: string;
      address?: string;
    } = {};

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
      payment: "",
      phone: "",
    };
  }
}
