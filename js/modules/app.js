/**
 * Created by Tauseef Naqvi on 03-03-2017.
 */
(function () {
    'use strict';
    angular.module('mainapp', [])
        .controller('BookCtrl', BookCtrl);

    // Functions - Definitions
    function BookCtrl($http) {

        // Variables - Private
        var host = "http://localhost:8080"; // define host http://localhost:8080
        var self = this;
        var skip = 0;
        var limitPerPage = 10;
        var search = " ";

        // Variables - Public
        self.limitPerPage = limitPerPage;
        self.host = host;
        self.filter = {};

        // debugger;
        $http.get(host + "/api/ebooks?skip=" + skip)
            .then(function (response) {
                self.books = response.data;
                skip = skip + limitPerPage;
            })
            .catch(function (error) {
                console.log(error);
            });

        self.loadMore = function () {
            if (!search)
                $http.get(host + "/api/ebooks?skip=" + skip)
            else
                $http.get(host + "/api/ebooks?skip=" + skip + "&search=" + search)
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++)
                            self.books.push(response.data[i]);
                        self.bookOnResponse = response.data.length;
                    });
            skip = skip + limitPerPage;
        };
        self.search = function (searchData) {
            skip = 0;
            $http.get(host + "/api/ebooks?skip=" + skip + "&search=" + searchData)
                .then(function (response) {
                    self.books = response.data;
                    self.bookOnResponse = response.data.length;
                });
            skip = skip + limitPerPage;
            search = searchData;
        };
        // Functions - Public
        self.filterByCategory = filterByCategory;
        self.getCategories = getCategories;
        self.getBooktypes = getBooktypes;
        function filterByCategory(book) {
            return noFilter(self.filter);
        }

        // Functions - Definitions
        function filterByCategory(book) {
            return self.filter[book.tag[0]] || self.filter[book.tag[1]] || noFilter(self.filter);
        }

        function getCategories() {
            return (self.books || []).map(function (book) {
                return book.tag[0];
            }).filter(function (cat, idx, arr) {
                return arr.indexOf(cat) === idx;
            });
        }

        function getBooktypes() {
            return (self.books || []).map(function (book) {
                return book.tag[1];
            }).filter(function (cat, idx, arr) {
                return arr.indexOf(cat) === idx;
            });
        }

        function noFilter(filterObj) {
            return Object.keys(filterObj).every(function (key) {
                return !filterObj[key];
            });
        }
    }
}());