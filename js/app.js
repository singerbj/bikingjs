

var app = angular.module('BikingApp', []);

app.controller('BikingController',['WebScrape', function(WebScrape){
  this.trailData = {};
  this.loading = false;
  this.filter = 'name';
  this.reverse = false;

  this.refresh = function(){
    this.trailData = WebScrape.getData();
  }();
}]);

app.service('WebScrape', function($http, $q){  
  this.getData = function(){
    var deferred = $q.defer();
    var array = [];
    //$http.get('/sample/tc.html').success(function(data){
    $http.get('http://www.corsproxy.com/morcmtb.org/forums/trailconditions.php').success(function(data){
      var rows = $("<div>").html(data)[0].querySelectorAll(".forumbits > tbody > tr");;
        for(var i = 0; i < rows.length; i++){
          var tds = rows[i].getElementsByTagName('td');
          if(tds[0].className != "conditiontitle"){
            var obj = {};
            obj.name = tds[0].textContent.replace(/(\r\n|\n|\r)/gm,"").replace(/^\s+|\s+$/g,'');  
            obj.condition = tds[1].textContent.replace(/(\r\n|\n|\r)/gm,"").replace(/^\s+|\s+$/g,'');  
            obj.description = tds[3].textContent.replace(/(\r\n|\n|\r)/gm,"").replace(/^\s+|\s+$/g,'');  
            obj.updated = tds[5].textContent.replace(/(\r\n|\n|\r)/gm,"").replace(/^\s+|\s+$/g,'');  
            array.push(obj);
          }
        }
        deferred.array = array;
        deferred.resolve();
    }).error(function(data){ 
      deferred.reject();
      console.log('Error');
    });
    return deferred;
  }
});


