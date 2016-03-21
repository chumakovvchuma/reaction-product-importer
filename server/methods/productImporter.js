

Meteor.methods({
  'productImporter/importProducts': function (productsList) {
    check(productsList, [Object]);
    //  group each Product by Product ID
    let products = _.groupBy(productsList, function (product) {
      return product.productId;
    });

  }
});
