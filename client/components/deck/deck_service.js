// ---------------------------------------------------------------------------------------------------------------------
// DeckService
//
// @module deck_service.js
// ---------------------------------------------------------------------------------------------------------------------

function DeckServiceFactory(Promise, $http, _)
{
    function PaginatedResults(service, endpoint, parameters)
    {
        this.service = service;
        this.endpoint = endpoint;
        this.parameters = parameters;
        this.response = { results: {} };
        this.limit = 12;
        this.resolved = false;
    } // end PaginatedResults

    PaginatedResults.prototype = {
        get offset(){ return this.response.results.offset || 0; },
        get total(){ return this.response.results.count },
        get totalPages(){ return Math.ceil(this.total / this.limit); },
        get results(){ return this.response.results.data; },

        get limit(){ return this.parameters.limit; },
        set limit(val){ this.parameters.limit = val; },

        get page(){ return Math.floor(this.offset / this.limit) + 1; },
        set page(page)
        {
            var self = this;
            self.resolved = false;
            this.parameters.offset = (page - 1) * this.limit;
            this.service._makeAPICall(this.endpoint, this.parameters)
               .then(function(response)
               {
                   self.response = response;
                   self.resolved = true;
               });
        }
    }; // end prototype

    PaginatedResults.prototype.execute = function()
    {
        var self = this;
        return this.service._makeAPICall(this.endpoint, this.parameters)
            .then(function(response)
            {
                self.response = response;
                self.resolved = true;
                return self;
            });
    }; // end next

    //------------------------------------------------------------------------------------------------------------------

    function DeckService()
    {
        this.baseURL = 'https://api.cardcastgame.com/v1';
    } // end DeckService

    DeckService.prototype._makeAPICall = function(endpoint, parameters)
    {
        parameters = _.defaults((parameters || {}), { sort: 'rating', direction: 'desc' });
        return $http.get(this.baseURL + endpoint, { params: parameters })
            .then(function(response)
            {
                return response.data;
            });
    }; // end _makeAPICall

    DeckService.prototype.getSuggested = function()
    {
        var self = this;
        return Promise.all([
                // Best of Cardcast
                self.getDeck('BOFCC'),

                // Cards Against Humanity Base Set
                self.getDeck('CAHBS'),

                // CAH - Expansion 1
                self.getDeck('CAHE1'),

                // CAH - Expansion 2
                self.getDeck('CAHE2'),

                // CAH - Expansion 3
                self.getDeck('CAHE3'),

                // CAH - Expansion 4
                self.getDeck('CAHE4'),

                // CAH - Expansion 5
                self.getDeck('NP74P'),

                // Programming Humor
                self.getDeck('W3HMJ')
            ]);
    }; // end getSuggested

    DeckService.prototype.getDeck = function(deckCode)
    {
        return this._makeAPICall('/decks/' + deckCode);
    }; // end getDeck

    DeckService.prototype.search = function(query, parameters)
    {
        parameters = _.defaults({ search: query }, parameters);
        return (new PaginatedResults(this, '/decks', parameters)).execute();
    }; // end search

    return new DeckService();
} // end DeckServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('card-crimes.services').service('DeckService', [
    '$q',
    '$http',
    'lodash',
    DeckServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------