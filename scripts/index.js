import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import Section from "./Section.js";

import PopupWithImage from "./PopupWithImage.js";
import PopupWithForm from "./PopupWithForm.js";
import UserInfo from "./UserInfo.js";

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

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-popup");

const addCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector("#new-card-popup");

const newCardForm = newCardModal.querySelector(".popup__form");

const nameInput = editProfileModal.querySelector(".popup__input_type_name");
const descriptionInput = editProfileModal.querySelector(
  ".popup__input_type_description",
);

const editProfileForm = editProfileModal.querySelector(".popup__form");

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

const editProfilePopup = new PopupWithForm("#edit-popup", (inputValues) => {
  userInfo.setUserInfo({
    name: inputValues.name,
    description: inputValues.description,
  });

  editProfilePopup.close();
});

const newCardPopup = new PopupWithForm("#new-card-popup", (inputValues) => {
  const cardElement = createCard({
    name: inputValues["place-name"],
    link: inputValues.link,
  });

  cardSection.addItem(cardElement);
  newCardPopup.close();
});

const imagePopup = new PopupWithImage("#image-popup");

const editProfileFormValidator = new FormValidator(
  validationConfig,
  editProfileForm,
);
const newCardFormValidator = new FormValidator(validationConfig, newCardForm);

function handleCardClick(name, link) {
  imagePopup.open({ name, link });
}

function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleCardClick);
  return card.generateCard();
}

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list",
);

cardSection.renderItems();

function fillProfileForm() {
  const currentUserInfo = userInfo.getUserInfo();

  nameInput.value = currentUserInfo.name;
  descriptionInput.value = currentUserInfo.description;
}

function handleOpenEditModal() {
  fillProfileForm();
  editProfileFormValidator.resetValidation();
  editProfilePopup.open();
}

function handleOpenNewCardModal() {
  newCardForm.reset();
  newCardFormValidator.resetValidation();
  newCardPopup.open();
}

editProfileFormValidator.setEventListeners();
newCardFormValidator.setEventListeners();

editProfileButton.addEventListener("click", handleOpenEditModal);
addCardButton.addEventListener("click", handleOpenNewCardModal);

editProfilePopup.setEventListeners();
newCardPopup.setEventListeners();
imagePopup.setEventListeners();
