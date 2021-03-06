(function() {
    'use strict';

    angular
        .module('BGGApp')
        .factory('bggXMLApiService', BGGXMLApiService);

    BGGXMLApiService.$inject = ['$resource', '$q', '$http', 'x2js'];

    function BGGXMLApiService($resource, $q, $http, x2js) {
        var bggApi = 'http://localhost:8000/xmlapi2';
        var bggApiOld = 'http://localhost:8000/xmlapi';
        var bggMarketApi = 'http://localhost:8000/geekmarket/api/v1';
        var defaultParams = {};
        
        var bggMarketResourceActions = {
            getPriceHistory: {
                method: 'GET',
                url: bggMarketApi + '/pricehistory?ajax=1&condition=any&currency=any&objectid=:gameId&objecttype=thing&pageid=1',
            }
        };

        var bggOLDResourceActions = {
            getList: {
                method: 'GET',
                url: bggApiOld + '/geeklist/:listId',
                transformResponse:function(data) {
                        var json = x2js.xml_str2json( data );
                        return json;
                }
            },
            getListWComments: {
                method: 'GET',
                url: bggApiOld + '/geeklist/:listId?comments=1',
                transformResponse:function(data) {
                        var json = x2js.xml_str2json( data );
                        return json;
                }
            }
        };
        
        var bggResourceActions = {
            getWantList: {
                method: 'GET',
                url: bggApi + '/collection?username=:userId&wishlist=1',
                transformResponse:function(data) {
                        var json = x2js.xml_str2json( data );
                        return json;
                }
            },
            
            getUser: {
                method: 'GET',
                url: bggApi + '/user?name=:userId',
                transformResponse:function(data) {
                        var json = x2js.xml_str2json( data );
                        return json;
                }
            }
        };


        var bggXMLOldResource = $resource(bggApiOld, defaultParams, bggOLDResourceActions);
        var bggXMLResource = $resource(bggApi, defaultParams, bggResourceActions);
        var bggMarketResource = $resource(bggMarketApi, defaultParams, bggMarketResourceActions);

        var service = {
            getList: getList,
            getListWComments: getListWComments,
            getWantList: getWantList,
            getUser: getUser,
            getPriceHistory: getPriceHistory
        };

        return service;
        
        function getPriceHistory(gameId) {
            if (!gameId) {
                return $q.reject({
                    msg: "Game ID must be defined"
                });
            }

            return $q.when(bggMarketResource.getPriceHistory({
                gameId: gameId
            }).$promise);
        }

        function getList(listId) {
            if (!listId) {
                return $q.reject({
                    msg: "List must be defined"
                });
            }

            return $q.when(bggXMLOldResource.getList({
                listId: listId
            }).$promise);
        }
        
        function getListWComments(listId) {
            if (!listId) {
                return $q.reject({
                    msg: "List ID must be defined"
                });
            }

            return $q.when(bggXMLOldResource.getListWComments({
                listId: listId
            }).$promise);
        }
        
        function getWantList(userId) {
            if (!userId) {
                return $q.reject({
                    msg: "Username must be defined"
                });
            }

            return $q.when(bggXMLResource.getWantList({
                userId: userId
            }).$promise);
        }
        
        function getUser(userId) {
            if (!userId) {
                return $q.reject({
                    msg: "Username must be defined"
                });
            }

            return $q.when(bggXMLResource.getUser({
                userId: userId
            }).$promise);
        }
    }
})
();
