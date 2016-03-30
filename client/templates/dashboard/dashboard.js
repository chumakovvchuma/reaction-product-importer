Template.dashboardProductImporter.onRendered(function () {
  Session.setDefault('importingProducts', false);
});

Template.dashboardProductImporter.helpers({
  // sampleTemplate: function () {
  //   let data = [{
  //     productId: '1',
  //     topProductType: 'simple',
  //     productTitle: 'Basic Reaction Product',
  //     vendor: 'Example Manufacturer',
  //     handle: 'example-product',
  //     variantTitle: 'Basic Example Variant',
  //     variantType: 'variant',
  //     title: 'Option 1 - Red Dwarf',
  //     optionTitle: 'Red',
  //     price: '19.99',
  //     qty: '19',
  //     weight: '35',
  //     taxable: 'true',
  //     hastags: ''
  //   }];
  //   return Papa.unparse(data);
  // },
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
          Session.set('importingProducts', true);
          Meteor.call('productImporter/importProducts', results.data);
        }
      }
    });
  },
  'click .downloadSample': function (event) {
    event.preventDefault();
    let data = [{
      productId: '1',
      topProductType: 'simple',
      productTitle: 'Basic Reaction Product',
      pageTitle: 'This is a basic product. You can do a lot with it.',
      vendor: 'Example Manufacturer',
      handle: 'example-product',
      variantTitle: 'Basic Example Variant',
      variantType: 'variant',
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
  }
});
