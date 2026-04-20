import { Api } from "./components/base/Api";
import { Communicator } from "./components/base/Communicator";
import { EventEmitter } from "./components/base/Events";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Products } from "./components/models/Products";
import { Presenter } from "./components/presenter/Presenter";
import { CardCatalog } from "./components/view/CardCatalog";
import { Gallery } from "./components/view/Gallery";
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import "./scss/styles.scss";
import { IBuyer, IOrder, IProduct } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";
import { cloneTemplate, ensureElement, ensureElementByID } from "./utils/utils";

//#region TESTS
const items = apiProducts.items;
const item0 = items[0];
const item1 = items[1];
const item2 = items[2];
const item3 = items[3];

console.log("----------TESTS----------");
console.log("----------Buyer----------");
const buyer = new Buyer();

let buyerData: Partial<IBuyer> = {
  email: "trololo@mail.ru",
  phone: "+123",
};

console.log("1. buyer.updateInformation(data):");
console.log(buyerData);
buyer.updateInformation(buyerData);
console.log("___OK!");

console.log("2. buyer.getInformation():");
console.log(buyer.getInformation());
console.log("___OK!");

console.log("3. buyer.validateInformation():");
console.log(buyer.validateInformation());
console.log("___OK!");

console.log("4. buyer.clearInformation():");
buyer.clearInformation();
console.log(buyer.getInformation());
console.log("___OK!");

console.log("----------Products----------");
const products = new Products();
console.log("1. products.productsArray:");
products.productsArray = items;
console.log(products.productsArray);
console.log("___OK!");

console.log("2. products.productSelected:");
products.productSelected = item0;
console.log(products.productSelected);
console.log("___OK!");

console.log("3. products.getProductByID(id):");
console.log(products.getProductByID(item1.id));
console.log(products.getProductByID("123"));
console.log("___OK!");

console.log("----------Basket----------");
const basketModel = new Basket();
console.log("1. basket.addProduct(item):");
basketModel.addProduct(item3);
basketModel.addProduct(item2);
basketModel.addProduct(item1);
basketModel.addProduct(item0);
console.log(basketModel.products);
console.log("___OK!");

console.log("2. basket.deleteProduct(item):");
basketModel.deleteProduct(item1.id);
console.log(basketModel.products);
console.log("___OK!");

console.log("3. basket.getTotalAmount():");
console.log(basketModel.getTotalAmount());
console.log("___OK!");

console.log("4. basket.getTotalCount():");
console.log(basketModel.getTotalCount());
console.log("___OK!");

console.log("5. basket.productInProducts(item):");
console.log(basketModel.isProductInProducts(item1.id));
console.log(basketModel.isProductInProducts(item0.id));
console.log("___OK!");

console.log("6. basket.clearProducts():");
basketModel.clearProducts();
console.log(basketModel.products);
console.log("___OK!");

console.log("----------Communicator----------");
const api = new Api(API_URL);
export const COMMUNICATOR = new Communicator(api);

COMMUNICATOR
  .getProducts()
  .then((res) => {
    console.log("----------getProducts----------");
    console.log("1. Get '/product/':");
    products.productsArray = res;
    console.log(products.productsArray);
    console.log("___OK!");
  })
  .catch((e) => {
    console.log(e);
  });

buyerData = {
  payment: "online",
  email: "ogogo@mail.ru",
  phone: "+799999999999999",
  address: "Moscow",
};

buyer.updateInformation(buyerData);

basketModel.addProduct(item3);
basketModel.addProduct(item1);
basketModel.addProduct(item0);

let dataOrder: IOrder = {
  ...buyer.getInformation(),
  total: basketModel.getTotalAmount(),
  items: basketModel.products.map((x) => x.id),
};

COMMUNICATOR
  .postOrder(dataOrder)
  .then((res) => {
    console.log("----------postOrder----------");
    console.log("1. Post '/order':");
    console.log("Попробуем купить товары, которые продаются.");
    console.log(res);
    console.log("___OK!");
  })
  .catch((e) => {
    console.log(e);
  });

basketModel.addProduct(item2);
dataOrder.items = basketModel.products.map((x) => x.id);

COMMUNICATOR
  .postOrder(dataOrder)
  .then((res) => {
    console.log("Попробуем купить товар, который не продаётся.");
    console.log(res);
    console.log("___OK!");
  })
  .catch((e) => {
    console.log("Попробуем купить товар, который не продаётся.");
    console.log(e);
    console.log("___OK!");
  });

basketModel.deleteProduct(item2.id);
//#endregion

basketModel.clearProducts();

const events = new EventEmitter();
const headerView = new Header(events, ensureElement<HTMLElement>(".header"));
const modalView = new Modal(events, ensureElement<HTMLElement>(".modal"));
const galleryView = new Gallery(events, ensureElement<HTMLElement>(".gallery"));

const cardCatalogTemplate = ensureElementByID("card-catalog");
const cardPreviewTemplate = ensureElementByID("card-preview");
const cardBasketTemplate = ensureElementByID("card-basket");
const basketTemplate = ensureElementByID("basket");

export const PRESENTER = new Presenter(events, basketTemplate, cardBasketTemplate, cardCatalogTemplate, cardPreviewTemplate, headerView, basketModel, modalView, galleryView, products);

headerView.initEventHandler();
modalView.initEventHandler();

PRESENTER.showHeaderCounter();
PRESENTER.loadGalleryCards();
