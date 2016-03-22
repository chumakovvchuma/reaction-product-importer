ProductImporter.existingProduct = function (product, type = 'variant') {
  check(product, Object);
  check(type, String);
  if (type === 'simple') {
    return ReactionCore.Collections.Products.findOne({
      title: product.title,
      vendor: product.vendor,
      ancestors: product.ancestors,
      type: type,
      handle: product.handle
    });
  }
  return ReactionCore.Collections.Products.findOne({
    title: product.title,
    ancestors: product.ancestors,
    type: type
  });
};

ProductImporter.groupBy = function (productList, groupIdentifier) {
  check(productList, [Object]);
  check(groupIdentifier, String);
  return _.groupBy(productList, function (product) {
    return product[groupIdentifier];
  });
};

ProductImporter.createTopLevelProduct = function (product) {
  check(product, [Object]);
  let baseProduct = product[0];
  let sameProduct = _.every(product, function (item) {
    const result = baseProduct.productTitle === item.productTitle;
    return result;
  });
  if (!sameProduct) {
    ReactionCore.Log.warn('One or more Products with productId ' + baseProduct.productId + ' have different product titles');
  }
  let maxPricedProduct = _.max(product, function (item) {
    return parseInt(item.price, 10);
  });
  let maxPrice = maxPricedProduct.price;
  let minPricedProduct = _.min(product, function (item) {
    return parseInt(item.price, 10);
  });
  let minPrice = minPricedProduct.price;
  let prod = {};
  prod.ancestors = [];
  prod.shopId = ReactionCore.getShopId();
  prod.title = baseProduct.productTitle;
  prod.vendor = baseProduct.vendor;
  prod.pageTitle = baseProduct.productTitle;
  prod.handle = baseProduct.handle;
  prod.isVisible = false;
  prod.description = baseProduct.description;
  prod.price = {};
  prod.price.max = maxPrice;
  prod.price.min = minPrice;
  prod.price.range = minPrice + '-' + maxPrice;
  let existingProduct = this.existingProduct(prod, 'simple');
  if (existingProduct) {
    ReactionCore.Log.warn('Found product = ' + existingProduct._id);
    ReactionCore.Log.warn(existingProduct.vendor + ' ' + existingProduct.title + ' has already been added.');
    return existingProduct._id;
  }
  let reactionProductId = ReactionCore.Collections.Products.insert(prod, {selector: {type: 'simple'}});
  ReactionCore.Log.info(prod.vendor + ' ' + prod.title + ' was successfully added to Products.');
  return reactionProductId;
};

ProductImporter.createMidLevelVariant = function (variant, ancestors) {
  check(variant, [Object]);
  check(ancestors, [String]);
  let baseVariant = variant[0];
  let sameVariant = _.every(variant, function (item) {
    return baseVariant.variantTitle === item.variantTitle;
  });
  if (!sameVariant) {
    ReactionCore.Log.warn('One or more Products with variantTitle ' + baseVariant.variantTitle + ' have different variant titles');
  }
  let inventory = _.reduce(variant, function (sum, item) {
    return sum + parseInt(item.qty, 10);
  }, 0);
  let prod = {};
  prod.ancestors = ancestors;
  prod.isVisible = false;
  prod.type = 'variant';
  prod.title = baseVariant.title;
  prod.price = baseVariant.price;
  prod.qty = inventory;
  let existingVariant = this.existingProduct(prod);
};

