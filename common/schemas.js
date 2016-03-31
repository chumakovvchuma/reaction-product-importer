ProductImporterCustomFields = new SimpleSchema({
  csvColumnName: {
    type: String,
    optional: true
  },
  productFieldName: {
    type: String,
    optional: true
  },
  valueType: {
    type: String,
    optional: true
  }
});
ReactionCore.Schemas.ProductImporterPackageConfig = new SimpleSchema([
  ReactionCore.Schemas.PackageConfig, {
    'settings.buffer.shipping': {
      type: Number,
      defaultValue: 3,
      label: 'Number of days to customer receiving date that orders need to fulfilled.',
      optional: true
    },
    'settings.buffer.returning': {
      type: Number,
      defaultValue: 4,
      label: 'Number of days past the customer use date, until orders should be returned.',
      optional: true
    },
    'settings.customFields.topProduct': {
      type: [ProductImporterCustomFields],
      optional: true
    }

  }
]);
