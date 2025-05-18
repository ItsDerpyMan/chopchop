document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.margin = "0";
document.body.style.scrollBehavior = "smooth";

const DEFAULT_STYLE = {
        decoration: "none",
        color: "black",
        margin_left: 30,
    };
const DEFAULT_LINK = {
        id: undefined,
        content: undefined,
        style: DEFAULT_STYLE,
    };

function Nav(params) {
    const defaults = {
        bg_color: "#f2f2f2",
        position: "sticky",
        padding: 10,
        top: 0,
    };

    Object.assign(this, defaults, params);

    this.init = function () {
        const nav = document.body.appendChild(document.createElement("nav"));
        nav.appendChild(document.createElement("ul"));

        nav.style.backgroundColor = this.bg_color;
        nav.style.position = this.position;
        nav.style.padding = `${this.padding}px`;
        nav.style.top = Number(this.top).toString();
    };
    this.init();
};

Nav.prototype.createLink = function(params) {
        const obj = Object.assign({}, {...DEFAULT_LINK, ...params});
        obj.style = Object.assign({}, {...DEFAULT_STYLE, ...obj.style});

        const link = document.querySelector("nav>ul")
            .appendChild(document.createElement("li"))
            .appendChild(document.createElement("a"));

        link.href = `#${obj.id}`;
        link.textContent = obj.content;
        link.style.textDecoration = obj.style.decoration;
        link.style.color = obj.style.color;
        link.style.marginLeft = `${obj.style.margin_left}px`;
    };

Nav.prototype.createLinks = function(array) {
        for (let i = 0; i < array.length; i++) {
            this.createLink(array[i]);
        }
    };

function Section(params) {
    const defaults = {
        id: undefined,
        padding: [100, 20],
        borderBottom: "1px solid #ccc",
        title: null,
        content: null
    };
    Object.assign(this, defaults, params || {});

    this.init = function () {
        const section = document.body.appendChild(document.createElement("section"));
        section.id = this.id;
        section.style.padding = `${this.padding[0]}px ${this.padding[1]}px`;
        section.style.borderBottom = this.borderBottom; // Fixed typo
        this.element = section;
    };
    this.init();
}

Section.prototype.createTitle = function (id, title) {
    const titleText = title !== undefined ? title : this.title || "Untitled";
    const h2 = document.getElementById(id).appendChild(document.createElement("h2"));
    h2.textContent = titleText;
};

Section.prototype.createParagraph = function (id, content) {
    const contentText = content !== undefined ? content : this.content || "No content";
    const p = document.getElementById(id).appendChild(document.createElement("p"));
    p.textContent = contentText;
};

Section.prototype.createSectionWithContent = function (params) {
    const defaults = {
        id: undefined,
        padding: [100, 20],
        borderBottom: "1px solid #ccc",
        title: null,
        content: null
    };
    const obj = Object.assign({}, defaults, params || {});

    const section = new Section(obj);

    if (obj.title !== null) {
        section.createTitle(obj.id, obj.title);
    }
    if (obj.content !== null) {
        section.createParagraph(obj.id, obj.content);
    }

    return section;
};

Section.prototype.createSectionsWithContent = function (array) {
    for (let i = 0; i < array.length; i++) {
        const sectionParams = {
            id: array[i].id,
            title: array[i].content,
            content: `This is the ${array[i].content} section.`
        };
        this.createSectionWithContent(sectionParams);
    }
};

const navbar = new Nav();

const arr = [
    { id: "home", content: "Kezdőlap" },
    { id: "services", content: "Szolgáltatások" },
    { id: "about", content: "Rólunk" },
    { id: "contact", content: "Kapcsolat" }
];

navbar.createLinks(arr);
const section = new Section();
section.createSectionsWithContent(arr);
