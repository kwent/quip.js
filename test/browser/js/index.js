var parametersEditor;
var responseEditor;

var Quip = require('quip.Quip');

var app = angular.module('QuipModule', []);

app.factory('QuipRequestFactory', function() {

  return {
    request: function(accessToken, apiName, methodName, methodParams, callback) {

      var quip = new Quip({
          // Personal User token (required)
          accessToken: accessToken
      });

      console.log('accessToken', accessToken);
      console.log('apiName', apiName);
      console.log('methodName', methodName);
      console.log('methodParams', methodParams);

      quip[apiName][methodName](JSON.parse(methodParams), function(err, data) {
        callback(err, data);
      });

    }
  }
});

app.controller('QuipController', function($scope, QuipRequestFactory) {

  //Default values
  $scope.quipAccessToken = 'accessToken';
  $scope.quipApiName = [
    {name:'Threads | th', value:'th'},
    {name:'Messages | msg', value:'msg'},
    {name:'Folders | fdr', value:'fdr'},
    {name:'Users | usr', value:'usr'}
  ];
  $scope.quipApiNameSelected = 'th';
  $scope.quipResponseSuccess = false;
  $scope.quipButtonSubmit = 'Request'

  $scope.$watch('quipApiNameSelected', function(newValue, oldValue) {
      QuipRequestFactory.request('fakeAccessToken', newValue, 'getMethods', null, function(response) {
        $scope.methodNameOptions = response;
        $scope.quipMethodNameSelected = $scope.methodNameOptions[0];
      });
    });

  $scope.request = function() {
    $scope.quipResponseSuccess = false;
    $scope.quipButtonSubmit = 'Loading...';
    QuipRequestFactory.request($scope.quipAccessToken, $scope.quipApiNameSelected, $scope.quipMethodNameSelected, parametersEditor.getValue(), function(err, data) {

      if (err)
      {
        responseEditor.setValue(err);
        $scope.$apply(function() {
          $scope.quipButtonSubmit = 'Request';
          $scope.quipResponseSuccess = false;
        });
      }
      else
      {
        responseEditor.setValue(JSON.stringify(data, undefined, 2));
        $scope.$apply(function() {
          $scope.quipButtonSubmit = 'Request';
          $scope.quipResponseSuccess = true;
        });
      }
    });
  };
});

document.onreadystatechange = function() {
  parametersEditor = ace.edit('parametersEditor');
  parametersEditor.setTheme('ace/theme/chrome');
  parametersEditor.getSession().setMode('ace/mode/json');

  responseEditor = ace.edit('responseEditor');
  responseEditor.setTheme('ace/theme/chrome');
  responseEditor.setReadOnly(true);
  responseEditor.setHighlightActiveLine(false);
  responseEditor.getSession().setMode('ace/mode/json');
}
