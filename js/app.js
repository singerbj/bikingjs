var app = angular.module('BikingApp', []);

app.controller('BikingController', ['WebScrape', function(WebScrape) {
    var self = this;

    self.trailData = [];
    self.loading = true;
    self.filter = 'name';
    self.reverse = false;


    self.refresh = function() {
        self.dataPromise = WebScrape.getData();
        self.dataPromise.promise.then(function(data){
            console.log(self.dataPromise.array);
            self.trailData = self.dataPromise.array;
            self.loading = false;
        });
    }();
}]);

app.service('WebScrape', function($http, $q) {
    this.getData = function() {
        var deferred = $q.defer();
        var array = [];
        //$http.get('/sample/tc.html').success(function(data){
        $http.get('http://crossorigin.me/http://morcmtb.org/forums/trailconditions.php').success(function(data) {
            var rows = $("<div>").html(data)[0].querySelectorAll(".forumbits > tbody > tr");
            for (var i = 0; i < rows.length; i++) {
                var tds = rows[i].getElementsByTagName('td');
                if (tds[0].className != "conditiontitle") {
                    var obj = {};
                    obj.name = tds[0].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, '');
                    obj.condition = tds[1].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, '');
                    obj.description = tds[3].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, '');
                    obj.updated = tds[5].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, '');
                    obj.updatedMS = Date.parse(tds[5].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, ''));
                    array.push(obj);
                }
            }
            deferred.array = array;
            deferred.resolve();
        }).error(function(data) {
            deferred.reject();
            console.log('Error');
        });
        return deferred;
    };
});
