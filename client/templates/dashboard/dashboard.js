Template.dashboardProductImporter.events({
  'submit #import-products-csv-form': function (event) {
    event.preventDefault();
    Papa.parse(event.target.csvImportProductsFile.files[0], {
      header: true,
      complete: function (results) {
        debugger;
      }
    });
  }
});
