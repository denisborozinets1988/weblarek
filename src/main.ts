import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Products } from "./components/Models/Products";
import "./scss/styles.scss";
import { apiProducts } from "./utils/data";

//#region TEST
console.log("----------Buyer test----------");
const buyer = new Buyer();

const buyerData = new Map<string, string>([
  ["payment", "тип платежа, которого нет"],
  ["email", "trololo@mail.ru"],
  ["qwerty", "поле, которого нет"],
]);
console.log("1. buyer.updateInformation():");
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

console.log("----------Basket test----------");
const basket = new Basket();
//#endregion
