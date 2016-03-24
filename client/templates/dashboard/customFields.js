Template.customFields.events({
  'submit #customFieldsForm': function () {
    event.preventDefault();
    let customField = {};
    customField.csvColumnName = event.target.columnName.value.trim();
    customField.productFieldName = event.target.productField.value.trim();
    customField.valueType = event.target.typeSelector.value;
    const productSelector = event.target.productSelector.value;
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
  }
});
