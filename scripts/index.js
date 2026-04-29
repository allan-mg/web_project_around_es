import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import { openModal, closeModal, handleOverlayClick } from "./utils.js";

const initialCards = [
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_yosemite.jpg",
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lake-louise.jpg",
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_latemar.jpg",
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/web-code/moved_lago.jpg",
  },
];

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const cardsList = document.querySelector(".cards__list");

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-popup");
const closeButton = editProfileModal.querySelector(".popup__close");

const addCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector("#new-card-popup");
const newCardCloseButton = newCardModal.querySelector(".popup__close");
const newCardForm = newCardModal.querySelector(".popup__form");
const cardNameInput = newCardModal.querySelector(
  ".popup__input_type_card-name",
);
const cardLinkInput = newCardModal.querySelector(".popup__input_type_url");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const nameInput = editProfileModal.querySelector(".popup__input_type_name");
const descriptionInput = editProfileModal.querySelector(
  ".popup__input_type_description",
);

const editProfileForm = editProfileModal.querySelector(".popup__form");

const imageModal = document.querySelector("#image-popup");
const imageModalCloseButton = imageModal.querySelector(".popup__close");
const imageModalImage = imageModal.querySelector(".popup__image");
const imageModalCaption = imageModal.querySelector(".popup__caption");

const editProfileFormValidator = new FormValidator(
  validationConfig,
  editProfileForm,
);
const newCardFormValidator = new FormValidator(validationConfig, newCardForm);

function handleImageClick(name, link) {
  imageModalImage.src = link;
  imageModalImage.alt = name;
  imageModalCaption.textContent = name;

  openModal(imageModal);
}

function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  return card.generateCard();
}

function renderCard(cardData, container) {
  const cardElement = createCard(cardData);
  container.prepend(cardElement);
}

function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
}

function handleOpenEditModal() {
  fillProfileForm();
  editProfileFormValidator.resetValidation();
  openModal(editProfileModal);
}

function handleOpenNewCardModal() {
  newCardForm.reset();
  newCardFormValidator.resetValidation();
  openModal(newCardModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;

  closeModal(editProfileModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  renderCard(
    {
      name: cardNameInput.value,
      link: cardLinkInput.value,
    },
    cardsList,
  );

  closeModal(newCardModal);
}

initialCards.forEach((cardData) => {
  renderCard(cardData, cardsList);
});

editProfileFormValidator.setEventListeners();
newCardFormValidator.setEventListeners();

editProfileButton.addEventListener("click", handleOpenEditModal);
addCardButton.addEventListener("click", handleOpenNewCardModal);

closeButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

newCardCloseButton.addEventListener("click", () => {
  closeModal(newCardModal);
});

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
newCardForm.addEventListener("submit", handleCardFormSubmit);

imageModalCloseButton.addEventListener("click", () => {
  closeModal(imageModal);
});

editProfileModal.addEventListener("click", handleOverlayClick);
newCardModal.addEventListener("click", handleOverlayClick);
imageModal.addEventListener("click", handleOverlayClick);
