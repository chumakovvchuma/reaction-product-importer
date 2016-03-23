Template.dashboardProductImporter.onRendered(function () {
  Session.setDefault('importingProducts', false);
});

Template.dashboardProductImporter.helpers({
  sampleTemplate: function () {
    let data = [{
      productId: '1',
      productTitle: 'Basic Reaction Product',
      vendor: 'Example Manufacturer',
      handle: 'example-product',
      variantTitle: 'Basic Example Variant',
      title: 'Option 1 - Red Dwarf',
      optionTitle: 'Red',
      price: '19.99',
      qty: '19',
      weight: '35',
      taxable: 'true',
      hastags: ''
    }];
    return Papa.unparse(data);
  },
  importingProducts: function () {
    return Session.get('importingProducts');
  },
  importSize: function () {
    return Session.get('importSize');
  }
});

Template.dashboardProductImporter.events({
  'submit #import-products-csv-form': function (event) {
    event.preventDefault();
    Papa.parse(event.target.csvImportProductsFile.files[0], {
      header: true,
      complete: function (results) {
        if (results && results.data) {
          Session.set('importSize', _.size(results.data));
          Session.set('importingProducts', true)
          Meteor.call('productImporter/importProducts', results.data);
        }
      }
    });
  },
  'click .downloadSample': function (event) {
    event.preventDefault();
    let data = [{
      productId: '1',
      productTitle: 'Basic Reaction Product',
      pageTitle: 'This is a basic product. You can do a lot with it.',
      vendor: 'Example Manufacturer',
      handle: 'example-product',
      variantTitle: 'Basic Example Variant',
      title: 'Option 1 - Red Dwarf',
      optionTitle: 'Red',
      price: '19.99',
      qty: '19',
      weight: '35',
      taxable: 'true',
      hastags: '',
      description: 'Sign in as administrator to edit.\nYou can clone this product from the product grid.'
    }];
    let unparse = Papa.unparse(data);
    let csvData = new Blob([unparse], {type: 'text/csv;charset=utf-8;'});
    let csvURL = window.URL.createObjectURL(csvData);
    let tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'productImporterTemplate.csv');
    tempLink.click();
  },
  'submit #customFieldsForm': function () {
    event.preventDefault();
    let customField = {};

    customField.csvColumnName = event.target.columnName.value.trim();
    customField.productFieldName = event.target.productField.value.trim();
    customField.valueType = event.target.typeSelector.value;
    const productSelector = event.target.productSelector.value;
    let columnNameWhiteSpace = customField.csvColumnName.match(/\s/g);
    let productFieldNameWhiteSpace = customField.productFieldName.match(/\s/g);
    let noWhiteSpace = columnNameWhiteSpace.length === 0 && productFieldNameWhiteSpace.length === 0;
    if (noWhiteSpace) {
      Meteor.call('productImporter/addCustomField', productSelector, customField);
    } else {
      Alerts.removeSeen();
      Alerts.add('No Spaces are allow in ColumnName or ProductFieldName', 'danger', {
        autoHide: true
      });
    }
  }
});
