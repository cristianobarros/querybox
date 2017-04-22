
const TemplateMenu = require("./template-menu");

TemplateMenuDevelopment = function() {};

TemplateMenuDevelopment.prototype = new TemplateMenu();

TemplateMenuDevelopment.prototype.buildTemplate = function() {
  const template = TemplateMenu.prototype.buildTemplate.call(this);
  template[2].submenu.unshift({
    label: 'Reload',
    accelerator: 'Ctrl+R',
    role: 'reload',
  });
  return template;
}

module.exports = TemplateMenuDevelopment;
