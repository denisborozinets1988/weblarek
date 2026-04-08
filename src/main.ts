import { Api } from "./components/base/Api";
import { Communicator } from "./components/base/Communicator";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Products } from "./components/Models/Products";
import "./scss/styles.scss";
import { IBuyer, IOrder } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

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
const basket = new Basket();
console.log("1. basket.addProduct(item):");
basket.addProduct(item3);
basket.addProduct(item2);
basket.addProduct(item1);
basket.addProduct(item0);
console.log(basket.products);
console.log("___OK!");

console.log("2. basket.deleteProduct(item):");
basket.deleteProduct(item1.id);
console.log(basket.products);
console.log("___OK!");

console.log("3. basket.getTotalAmount():");
console.log(basket.getTotalAmount());
console.log("___OK!");

console.log("4. basket.getTotalCount():");
console.log(basket.getTotalCount());
console.log("___OK!");

console.log("5. basket.productInProducts(item):");
console.log(basket.isProductInProducts(item1.id));
console.log(basket.isProductInProducts(item0.id));
console.log("___OK!");

console.log("6. basket.clearProducts():");
basket.clearProducts();
console.log(basket.products);
console.log("___OK!");

console.log("----------Communicator----------");
const api = new Api(API_URL);
const communicator = new Communicator(api);

communicator
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

basket.addProduct(item3);
basket.addProduct(item1);
basket.addProduct(item0);

let dataOrder: IOrder = {
  ...buyer.getInformation(),
  total: basket.getTotalAmount(),
  items: basket.products.map((x) => x.id),
};

communicator
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

basket.addProduct(item2);
dataOrder.items = basket.products.map((x) => x.id);

communicator
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
//#endregion
