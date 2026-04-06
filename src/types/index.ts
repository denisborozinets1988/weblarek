export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type PaymentType = "" | "неверный тип" | "2" | "3";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  price: number | null;
}

export interface IBuyer {
  payment: PaymentType;
  email: string;
  phone: string;
  address: string;
}
