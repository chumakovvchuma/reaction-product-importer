function getProductImporterPackage() {
  return ReactionCore.Collections.Packages.findOne({
    name: 'reaction-product-importer',
    shopId: ReactionCore.getShopId()
  });
}
Template.customFields.helpers({
  anyCustomFields: function () {
    const productImporter = getProductImporterPackage();
    return _.some(productImporter.settings.customFields, function (level) {
      return level.length > 0;
    });
  },
  customTopProducts: function () {
    const productImporter = getProductImporterPackage();
    return productImporter.settings.customFields.topProduct;
  },
  customMidVariant: function () {
    const productImporter = getProductImporterPackage();
    return productImporter.settings.customFields.midVariant;
  },
  customVariant: function () {
    const productImporter = getProductImporterPackage();
    return productImporter.settings.customFields.variant;
  }


});

Template.customFields.events({
  'submit #customFieldsForm': function () {
    event.preventDefault();
    let customField = {};
    customField.csvColumnName = event.target.columnName.value.trim();
    customField.productFieldName = event.target.productField.value.trim();
    customField.valueType = event.target.typeSelector.value;
    const productSelector = event.target.productSelector.value;
    let columnNameWhiteSpace = customField.csvColumnName.search(/\s/g);
    let productFieldNameWhiteSpace = customField.productFieldName.search(/\s/g);
    let noWhiteSpace = columnNameWhiteSpace + productFieldNameWhiteSpace === -2;
    if (noWhiteSpace) {
      Meteor.call('productImporter/addCustomField', productSelector, customField);
    } else {
      Alerts.removeSeen();
      Alerts.add('No Spaces are allow in ColumnName or ProductFieldName', 'danger', {
        autoHide: true
      });
    }
    event.target.columnName.value = '';
    event.target.productField.value = '';
  }
});
