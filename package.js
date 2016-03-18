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

  api.addFiles('server/register.js', 'server');

  api.addFiles([
    'client/templates/dashboard/dashboard.html',
    'client/templates/dashboard/dashboard.js',
    'client/templates/settings/settings.html',
    'client/templates/settings/settings.js'
  ], 'client');
});
