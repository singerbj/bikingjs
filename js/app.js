var app = angular.module('BikingApp', []);

app.controller('BikingController', ['WebScrape', function(WebScrape) {
    var self = this;
    self.trailData = [];
    self.loading = true;
    self.error = false;
    self.filter = 'name';
    self.reverse = false;
    self.url = "http://morcmtb.org/forums/trailconditions.php";

    self.refresh = function() {
        self.dataPromise = WebScrape.getData(self.url);
        self.dataPromise.promise.then(function(data){
            console.log(self.dataPromise.array);
            self.trailData = self.dataPromise.array;
        }).catch(function(){
            self.error = true;
        }).finally(function(){
            self.loading = false;
        });
    }();
}]);

app.service('WebScrape', function($http, $q) {
    this.getData = function(url) {
        var deferred = $q.defer();
        var array = [];
        $http.get('http://crossorigin.me/' + url).success(function(data) {
            var rows = $("<div>").html(data)[0].querySelectorAll(".forumbits > tbody > tr");
            if(rows.length > 0){
                for (var i = 0; i < rows.length; i++) {
                    var tds = rows[i].getElementsByTagName('td');
                    if (tds[0].className != "conditiontitle") {
                        var obj = {};
                        obj.url = $(tds[0]).children()[0].getAttribute('href');
                        obj.name = $(tds[0]).children()[0].innerText;
                        obj.condition = tds[1].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, '');
                        obj.description = tds[3].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, '');
                        obj.updatedMS = Date.parse(tds[5].textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, ''));
                        array.push(obj);
                    }
                }
                deferred.array = array;
                deferred.resolve();
            }else{
                deferred.reject();
                console.error('Error: No data was found.');
            }
        }).error(function(data) {
            deferred.reject();
            console.error('Error: There was a problem with the request.');
        });
        return deferred;
    };
});
