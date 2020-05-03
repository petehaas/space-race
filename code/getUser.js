var console = require('console')
var airTable = require('./lib/airtable');

module.exports.function = function getUser(previousUser, numberOfTurns, $vivContext) {

var result = airTable.getUser($vivContext.bixbyUserId);

   // Add user?
  if (result && result.records.length == 0) {
      
     result = airTable.addUser({
       fields: {
         id: $vivContext.bixbyUserId,
         sessionId:  $vivContext.sessionId
       }
     });

     return  {
          previousUser: false,
          numberOfTurns: numberOfTurns
     };

  }

  return  {
    previousUser: true,
    numberOfTurns: result.records.length
  };


}
