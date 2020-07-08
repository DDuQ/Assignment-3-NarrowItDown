(function() {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
.directive('foundItems', foundItemsDirective);

function foundItemsDirective() {
  var ddo= {
    templateUrl: 'foundItems.html' ,
    restrict: 'E',
    scope: {
      items: '<',
      onRemove: '&',
      checked: '<'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this ;

  menu.checked= true;
  menu.searchTerm= "";
  menu.found = [];
  menu.getMatchedMenuItems = function () {
      if(menu.searchTerm == ""){
        menu.found = [];
        menu.checked = false;
      }else {
        menu.checked=true;
      };


    if (menu.checked == true){
      menu.found = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    }
      console.log("My SearchTerm is:  ", menu.searchTerm );
      console.log("menu.found is retrieving: ", menu.found);

  };


  menu.removeItem = function (itemIndex) {
  menu.found.splice(itemIndex, 1);
  };




}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var foundItems = [];

  service.getMatchedMenuItems = function (searchTerm) {
    foundItems= [];
    searchTerm = searchTerm.trim().toLowerCase();
    var response = $http({
      method: "GET",
      url:ApiBasePath
    })
    .then(function (response) {
      for(var i=0; i < response.data.menu_items.length ; i++){
        if ( response.data.menu_items[i].name.toLowerCase().indexOf(searchTerm) !== -1){
          foundItems.push(response.data.menu_items[i]);
        }
      }
    })
    .catch(function (error) {
      console.log("Help");
    });
    return foundItems;
  }

}


}());
