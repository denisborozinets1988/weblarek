export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type PaymentType = "" | "неверный тип" | "online";

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
  category: string;
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

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export type IErrorsBayer = Partial<Record<keyof IBuyer, string>>;
