
const TemplateMenu = require("./template-menu");

var TemplateMenuDevelopment = function() {};

TemplateMenuDevelopment.prototype = new TemplateMenu();

TemplateMenuDevelopment.prototype.buildTemplate = function(keybindings) {
  const template = TemplateMenu.prototype.buildTemplate.call(this, keybindings);
  template[2].submenu.unshift({
    label: 'Reload',
    accelerator: 'Ctrl+R',
    role: 'reload',
  });
  return template;
}

module.exports = TemplateMenuDevelopment;
