function getProductImporterPackage() {
  return ReactionCore.Collections.Packages.findOne({
    name: 'reaction-product-importer',
    shopId: ReactionCore.getShopId()
  });
}

Template.customFields.onRendered(function () {
  Session.setDefault('ifArray', false);
  Session.setDefault('ifObject', false);
});

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
  },
  ifArray: function () {
    return Session.get('ifArray');
  },
  ifObject: function () {
    return Session.get('ifObject');
  },
  arrayOrObject: function () {
    return Session.get('ifArray') || Session.get('ifObject');
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
    if (customField.valueType === 'array' || customField.valueType === 'object') {
      customField.options = {};
      customField.options.delimiter = event.target.delimiterSymbol.value;
      customField.options.typeSelector = event.target.optionTypeSelector.value;
    }
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
    Session.set('ifArray', false);
    Session.set('ifObject', false);
  },
  'change form #typeSelector': function () {
    event.preventDefault();
    let selectedType = event.target.value;
    if (selectedType === 'array') {
      Session.set('ifArray', true);
      Session.set('ifObject', false);
    } else if (selectedType === 'object') {
      Session.set('ifArray', false);
      Session.set('ifObject', true);
    } else {
      Session.set('ifArray', false);
      Session.set('ifObject', false);
    }
  },
  'click .remove': function (event) {
    event.preventDefault();
    let customRemoval = {};
    customRemoval.level = event.currentTarget.dataset.level;
    customRemoval.csvColumnName = event.currentTarget.dataset.csvColumnName;
    customRemoval.productFieldName = event.currentTarget.dataset.productFieldName;
    customRemoval.valueType = event.currentTarget.dataset.valueType;
    if (Object.keys(customRemoval).length === 4) {
      Meteor.call('productImport/removeCustomField', customRemoval);
    }
  }
});
