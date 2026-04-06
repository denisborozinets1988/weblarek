import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Products } from "./components/Models/Products";
import "./scss/styles.scss";
import { apiProducts } from "./utils/data";

//#region TESTS
const items = apiProducts.items;
const item0 = items[0];
const item1 = items[1];
const item2 = items[2];
const item3 = items[3];

console.log("----------Buyer test----------");
const buyer = new Buyer();

const buyerData = new Map<string, string>([
  ["payment", "тип платежа, которого нет"],
  ["email", "trololo@mail.ru"],
  ["qwerty", "поле, которого нет"],
]);
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

console.log("----------Products test----------");
const products = new Products();
console.log("1. products.productsArray:");
products.productsArray = items;
console.log(products.productsArray);
console.log("___OK!");

console.log("2. products.productSelected:");
products.productSelected = item0;
console.log(products.productSelected);
console.log("___OK!");

console.log("2. products.getProductByID(id):");
console.log(products.getProductByID(item1.id));
console.log(products.getProductByID("123"));
console.log("___OK!");

console.log("----------Basket test----------");
const basket = new Basket();
console.log("1. basket.addProduct(item):");
basket.addProduct(item3);
basket.addProduct(item2);
basket.addProduct(item1);
basket.addProduct(item0);
console.log(basket.products);
console.log("___OK!");

console.log("2. basket.deleteProduct(item):");
basket.deleteProduct(item1);
console.log(basket.products);
console.log("___OK!");

console.log("3. basket.getTotalAmount():");
console.log(basket.getTotalAmount());
console.log("___OK!");

console.log("3. basket.getTotalCount():");
console.log(basket.getTotalCount());
console.log("___OK!");

console.log("4. basket.productInProducts(item):");
console.log(basket.productInProducts(item1));
console.log(basket.productInProducts(item0));
console.log("___OK!");

console.log("5. basket.clearProducts():");
basket.clearProducts();
console.log(basket.products);
console.log("___OK!");
//#endregion
