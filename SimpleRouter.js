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
    home: new Page("home", "Home"),
    about: new Page("about", "About"),
    contact: new Page("contact", "Contact"),
  };
  #currentRoute = "home";

  constructor(idHtml) {
    this.idHtml = idHtml;

    if (window.location.hash !== "") {
      this.currentRoute = localStorage.getItem("route") || "home";
    }
    this.addListeners();
    window.location.hash = this.currentRoute;
  }

  set currentRoute(route) {
    this.#currentRoute = route;
    localStorage.setItem("route", route);
  }
  get currentRoute() {
    return this.#currentRoute;
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  onPopStateHandler(event) {
    console.log("onPopStateHandler", event.state);
  }

  hashChangeHandler() {
    let { hash, href } = window.location;
    hash = hash.slice(1) || "home";

    console.log("hashChangeHandler", this.currentRoute, href);

    // if (this.currentRoute === hash) {
    //   window.history.replaceState({ hash }, "", href);
    // } else {
    // window.history.pushState({ hash }, "", href);
    // }

    this.currentRoute = hash;
    this.render();
  }

  addListeners() {
    const btnBack = document.querySelector("header > button:first-of-type");
    const btnForward = document.querySelector("header > button:last-of-type");

    btnBack.addEventListener("click", this.back.bind(this));
    btnForward.addEventListener("click", this.forward.bind(this));

    window.addEventListener("popstate", this.onPopStateHandler.bind(this));

    window.addEventListener("hashchange", this.hashChangeHandler.bind(this));
    window.addEventListener("load", this.hashChangeHandler.bind(this));
  }

  async render() {
    const page = this.routes[this.currentRoute];

    document.getElementById(this.idHtml).innerHTML = await page.render();
    document.title = page.title;
  }
}

class App {
  static init() {
    const route = new Router("root");
  }
}
App.init();
