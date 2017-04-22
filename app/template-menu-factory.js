
const TemplateMenu = require("./template-menu");
const TemplateMenuDevelopment = require("./template-menu-development");

let template;

if (process.env.NODE_ENV === 'development') {
  template = new TemplateMenuDevelopment();
} else {
  template = new TemplateMenu();
}

module.exports = template;
