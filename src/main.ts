import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { Communicator } from "./components/base/Communicator";
import { EventEmitter } from "./components/base/Events";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Products } from "./components/models/Products";
import { Presenter } from "./components/presenter/Presenter";
import { Gallery } from "./components/view/Gallery";
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { TemplateManager } from "./components/view/TemplateManager";
import { API_URL } from "./utils/constants";
import { ensureElement } from "./utils/utils";

const api = new Api(API_URL);
const communicator = new Communicator(api);

const buyer = new Buyer();
const products = new Products();
const basketModel = new Basket();

const events = new EventEmitter();
const headerView = new Header(events, ensureElement<HTMLElement>(".header"));
const modalView = new Modal(events, ensureElement<HTMLElement>(".modal"));
const galleryView = new Gallery(events, ensureElement<HTMLElement>(".gallery"));

const templateManager = new TemplateManager();

export const PRESENTER = new Presenter(communicator, events, templateManager, headerView, basketModel, modalView, galleryView, products, buyer);

headerView.initEventHandler();
modalView.initEventHandler();

PRESENTER.showHeaderCounter();
PRESENTER.loadGalleryCards();
