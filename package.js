Package.describe({
  summary: 'Import Products from a CSV',
  name: 'getoutfitted:reaction-product-importer',
  version: '0.1.0',
  git: 'https://github.com/getoutfitted/reaction-product-importer'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.1');
  api.use('meteor-platform');
  api.use('http');
  api.use('underscore');
  api.use('reactioncommerce:core@0.12.0');
  api.use('momentjs:moment@2.10.6');
  api.use('momentjs:twix@0.7.2');
  api.use('harrison:papa-parse@1.1.1');
  api.use('reactioncommerce:reaction-schemas');
  api.use('reactioncommerce:reaction-collections');

  api.addFiles('lib/productImporter.js');
  api.addFiles('server/register.js', 'server');

  api.addFiles([
    'common/schemas.js'
  ]);

  api.addFiles([
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js',
    'client/templates/dashboard/customFields.html',
    'client/templates/dashboard/customFields.js',
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js'
  ], 'client');

  api.addFiles([
    'server/methods/productImporter.js',
    'server/productImporter.js'
  ], 'server');
});

Package.onTest(function (api) {
  api.use('sanjo:jasmine@0.21.0');
  api.use('underscore');
  api.use('random');
  api.use('dburles:factory@0.3.10');
  api.use('velocity:html-reporter@0.9.1');
  api.use('velocity:console-reporter@0.1.4');
  api.use('velocity:helpers');
  api.use('reactioncommerce:reaction-factories');

  api.use('reactioncommerce:core@0.12.0');
  api.use('getoutfitted:reaction-product-importer');
  api.addFiles('lib/productImporter.js');
  api.export('ProductImporter');

  api.addFiles('tests/jasmine/server/integration/methods/productImporter.js', 'server');
  api.addFiles('tests/jasmine/server/unit/productImporter.js', 'server');
});
