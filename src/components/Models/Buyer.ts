import { IBuyer, PaymentType } from "../../types";

/**
 * Покупатель.
 */
export class Buyer implements IBuyer {
  payment: PaymentType = "";
  email: string = "";
  phone: string = "";
  address: string = "";

  /*constructor(data: Map<string, string>) {
    this.updateInformation(data);
  }*/

  /**
   * Обновить информацию о покупателе.
   * @param data данные для обновления.
   */
  updateInformation(data: Map<string, string>): void {
    data.forEach((value, key) => {
      switch (key) {
        case "payment":
          const validValues: PaymentType[] = ["online"];
          this.payment = validValues.includes(value as PaymentType)
            ? (value as PaymentType)
            : "неверный тип";
          break;
        case "email":
          this.email = value;
          break;
        case "phone":
          this.phone = value;
          break;
        case "address":
          this.address = value;
          break;
      }
    });
  }

  /**
   * Получить информацию о покупателе.
   * @returns этот класс как IBuyer.
   */
  getInformation(): IBuyer {
    return this;
  }

  /**
   * Валидация информации о покупателе.
   * @returns объект с проблемными полями.
   */
  validateInformation(): object {
    let result: {
      payment?: string;
      email?: string;
      phone?: string;
      address?: string;
    } = {};

    for (const key in this) {
      if (key === "payment" && this[key] === "неверный тип") {
        result.payment = "В поле 'payment' был задан неверный тип оплаты.";
      } else if (this[key] === "") {
        let err = `Поле ${key} не заполнено.`;
        switch (key) {
          case "payment":
            result.payment = err;
            break;
          case "email":
            result.email = err;
            break;
          case "phone":
            result.phone = err;
            break;
          case "address":
            result.address = err;
            break;
        }
      }
    }

    return result;
  }

  /**
   * Очистить информацию о покупателе.
   */
  clearInformation(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }
}
