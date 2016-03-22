
function createProduct(product) {
  check(product, Object);

}

function topLevelProduct(product) {
  check(product, [Object]);
  let baseProduct = product[0];
  let reactionProduct = ProductImporter.existingProductCheck(baseProduct);
  let reactionProductId;
  if (reactionProduct) {
    reactionProductId = reactionProduct._id;
    ReactionCore.Log.warn('Found top level product = ' + reactionProductId);
    ReactionCore.Log.warn(baseProduct.vendor + ' ' + baseProduct.title + ' has already been added.');
  } else {
    let prod = createProduct(baseProduct);
    // reactionProductId = ReactionCore.Collections.Products.insert(prod, {selector: {type: 'simple'}});
    // ReactionCore.Log.info(prod.vendor + ' ' + prod.title + ' was successfully added to Products.');
  }

}

Meteor.methods({
  'productImporter/importProducts': function (productsList) {
    check(productsList, [Object]);
    //  group each Product by Product ID
    let productsById = ProductImporter.groupBy(productsList, 'productId');

    _.each(productsById, function (product) {
      let ancestors = [];
      ancestors.push(ProductImporter.createTopLevelProduct(product));
      // group each variant by variant title
      let variantGroups = ProductImporter.groupBy(product, 'variantTitle');
      _.each(variantGroups, function (variantGroup) {
        ProductImporter.createMidLevelVariant(variantGroup, ancestors)
        // ancestors.push(ProductImporter.createMidLevelVariant(variantGroup));
      });
    });
  }
});
