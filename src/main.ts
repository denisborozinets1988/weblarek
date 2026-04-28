import "./scss/styles.scss";
import { API_URL } from "./utils/constants";
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
import { ensureElement } from "./utils/utils";
import { FormOrder } from "./components/view/FormOrder";
import { FormContacts } from "./components/view/FormContacts";
import { FormFinal } from "./components/view/FormFinal";
import { CardPreview } from "./components/view/CardPreview";
import { FormBasket } from "./components/view/FormBasket";

const communicator = new Communicator(new Api(API_URL));
const events = new EventEmitter();
const templateManager = new TemplateManager();

const headerView = new Header(ensureElement<HTMLElement>(".header"), events);
const modalView = new Modal(ensureElement<HTMLElement>(".modal"), events);
const galleryView = new Gallery(ensureElement<HTMLElement>(".gallery"));
const cardPreviewView = new CardPreview(templateManager.cardPreviewTemplate, events);

const formBasket = new FormBasket(templateManager.basketTemplate, events);
const formOrder = new FormOrder(templateManager.orderTemplate, events);
const formContacts = new FormContacts(templateManager.contactsTemplate, events);
const formFinal = new FormFinal(templateManager.successTemplate, events);

const basketModel = new Basket(events);
const productsModel = new Products(events);
const buyerModel = new Buyer(events);

const PRESENTER = new Presenter(
    communicator, events, templateManager,
    headerView, modalView, galleryView, cardPreviewView,
    formBasket, formOrder, formContacts, formFinal,
    basketModel, productsModel, buyerModel);
PRESENTER.initListeners();
PRESENTER.loadGalleryCards();
