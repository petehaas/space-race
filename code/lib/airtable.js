var config = require('config');
var console = require('console');
var secret = require('secret');
var http = require('http');

var baseApi = "https://api.airtable.com/v0/";
var table = "SpaceX";

var options = {  format: 'json',
                 passAsJson: true, 
                 cacheTime: 0,
                 headers: { 
                   Authorization: 'Bearer ' + secret.get("airTableKey")
                 }
                 };

function getUser(userId) {
  
  var url = baseApi + 
            config.get('airTableBaseId') + "/" + 
            table + 
           '?filterByFormula=id="' + userId + '"';
  
  var result = http.getUrl(url,options);
  
  console.log('getUser-Air Table Result: ',result);

  return result;
  
}

function addUser(record) {

  var url = baseApi + config.get('airTableBaseId') + "/" + table;
  
  var result = http.postUrl(url,record,options);
  
  console.log('addUser-Air Table Result: ',result);
}

module.exports = {
  getUser: getUser,
  addUser: addUser
};
