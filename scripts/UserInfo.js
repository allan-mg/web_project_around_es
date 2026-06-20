export default class UserInfo {
  constructor({ nameSelector, jobSelector, avatarSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
    this._avatarElement = document.querySelector(avatarSelector);
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      description: this._jobElement.textContent,
    };
  }

  setUserInfo({ name, description, avatar }) {
    this._nameElement.textContent = name;
    this._jobElement.textContent = description;

    if (avatar) {
      this._avatarElement.src = avatar;
    }
  }
}
