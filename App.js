class Page {
  constructor(name, title) {
    this.name = name;
    this.title = title;
  }

  async render() {
    const response = await fetch(`/templates/${this.name}.html`);
    const data = await response.text();
    return data;
  }
}

class Router {
  routes = {
    "/": new Page("home", "Home"),
    about: new Page("about", "About"),
    contact: new Page("contact", "Contact"),
  };

  constructor(idHtml) {
    this.idHtml = idHtml;
    this.currentRoute = window.location.hash?.slice(1) || "/";
    this.addListeners();
  }

  addToHistory(event) {
    event.preventDefault();

    let { hash, href } = event.target;
    hash = hash.slice(1) || "/";

    if (this.currentRoute === hash) {
      window.history.replaceState({ hash }, "", href);
    } else {
      window.history.pushState({ hash }, "", href);
    }

    this.currentRoute = hash;
    this.render();
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  onPopStateHandler(event) {
    if (event.state) {
      this.currentRoute = event.state.hash;
    } else {
      this.currentRoute = "/";
    }
    this.render();
  }

  addListeners() {
    const links = document.querySelectorAll("header nav ul li a");
    const btnBack = document.querySelector("header > button:first-of-type");
    const btnForward = document.querySelector("header > button:last-of-type");

    for (let link of links) {
      link.addEventListener("click", this.addToHistory.bind(this));
    }

    btnBack.addEventListener("click", this.back.bind(this));
    btnForward.addEventListener("click", this.forward.bind(this));

    window.addEventListener("popstate", this.onPopStateHandler.bind(this));

    window.addEventListener("load", this.render.bind(this));
  }

  async render() {
    const page = this.routes[this.currentRoute];

    document.getElementById(this.idHtml).innerHTML = await page.render();
    document.title = page.title;
  }
}

class App {
  static init() {
    let expires = new Date(Date.now() + 10 * 1000);
    document.cookie =
      "cookie" +
      "=" +
      "1" +
      ";" +
      `expires=${expires.toUTCString()}` +
      ";path=/";

    localStorage.setItem("keyExpires", expires.toUTCString());

    new Router("root");
  }

  static checkCookie() {
    let cookieExpiresLocalTime = new Date(localStorage.getItem("keyExpires"));
    let localTime = new Date(new Date().toGMTString());
    let expirationInterval = cookieExpiresLocalTime - localTime;

    if (expirationInterval > 0) {
      setTimeout(() => {
        alert("Cookie expired!");
      }, expirationInterval);
    }
  } 
}
App.init();
App.checkCookie();
