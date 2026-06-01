import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import Section from "./Section.js";
import PopupWithImage from "./PopupWithImage.js";
import PopupWithForm from "./PopupWithForm.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";
import UserInfo from "./UserInfo.js";
import Api from "./Api.js";

let currentUserId;

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const api = new Api({
  baseUrl: "https://around-api.es.tripleten-services.com/v1",
  headers: {
    authorization: "1c8d5a26-e676-49b0-8c9a-09a17658e438",
    "Content-Type": "application/json",
  },
});

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

const avatarEditButton = document.querySelector(".profile__image-edit-button");
const avatarModal = document.querySelector("#avatar-popup");
const avatarForm = avatarModal.querySelector(".popup__form");

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

const imagePopup = new PopupWithImage("#image-popup");
const deleteCardPopup = new PopupWithConfirmation("#delete-card-popup");

const editProfilePopup = new PopupWithForm("#edit-popup", (inputValues) => {
  editProfilePopup.renderLoading(true);

  api
    .updateUserInfo({
      name: inputValues.name,
      about: inputValues.description,
    })
    .then((userData) => {
      userInfo.setUserInfo({
        name: userData.name,
        description: userData.about,
        avatar: userData.avatar,
      });

      editProfilePopup.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      editProfilePopup.renderLoading(false);
    });
});

const newCardPopup = new PopupWithForm("#new-card-popup", (inputValues) => {
  newCardPopup.renderLoading(true);

  api
    .addCard({
      name: inputValues["place-name"],
      link: inputValues.link,
    })
    .then((newCard) => {
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      newCardPopup.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      newCardPopup.renderLoading(false);
    });
});

const avatarPopup = new PopupWithForm("#avatar-popup", (inputValues) => {
  avatarPopup.renderLoading(true);

  api
    .updateAvatar(inputValues.avatar)
    .then((userData) => {
      userInfo.setUserInfo({
        name: userData.name,
        description: userData.about,
        avatar: userData.avatar,
      });

      avatarPopup.close();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      avatarPopup.renderLoading(false);
    });
});

const editProfileFormValidator = new FormValidator(
  validationConfig,
  editProfileForm,
);

const newCardFormValidator = new FormValidator(validationConfig, newCardForm);

const avatarFormValidator = new FormValidator(validationConfig, avatarForm);

function createCard(cardData) {
  const card = new Card(
    cardData,
    "#card-template",

    (name, link) => {
      imagePopup.open({ name, link });
    },

    (cardInstance) => {
      if (cardInstance.isLiked()) {
        api
          .dislikeCard(cardInstance.getId())
          .then((updatedCard) => {
            cardInstance.setLikeStatus(updatedCard.isLiked);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        api
          .likeCard(cardInstance.getId())
          .then((updatedCard) => {
            cardInstance.setLikeStatus(updatedCard.isLiked);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },

    (cardInstance) => {
      deleteCardPopup.setSubmitAction(() => {
        api
          .deleteCard(cardInstance.getId())
          .then(() => {
            cardInstance.deleteCard();
            deleteCardPopup.close();
          })
          .catch((err) => {
            console.error(err);
          });
      });

      deleteCardPopup.open();
    },

    currentUserId,
  );

  return card.generateCard();
}

const cardSection = new Section(
  {
    items: [],
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list",
);

api
  .getAppInfo()
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    userInfo.setUserInfo({
      name: userData.name,
      description: userData.about,
      avatar: userData.avatar,
    });

    cards.forEach((cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

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

function handleOpenAvatarModal() {
  avatarForm.reset();
  avatarFormValidator.resetValidation();
  avatarPopup.open();
}

editProfileFormValidator.setEventListeners();
newCardFormValidator.setEventListeners();
avatarFormValidator.setEventListeners();

editProfileButton.addEventListener("click", handleOpenEditModal);
addCardButton.addEventListener("click", handleOpenNewCardModal);

avatarEditButton.addEventListener("click", handleOpenAvatarModal);

editProfilePopup.setEventListeners();
newCardPopup.setEventListeners();
avatarPopup.setEventListeners();
deleteCardPopup.setEventListeners();
imagePopup.setEventListeners();
