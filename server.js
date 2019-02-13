var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'CalcCharge')
    {
      result = serviceCharge(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function serviceCharge(query)
{
  if (query['checkBal'] == undefined || query['savingsBal'] == undefined ||  query['checks'] == undefined)  
    throw Error("You must specify a chekings balance, a savings balance, and the amount of checks." );
  if (query['checkBal'] < 0 || query['savingsBal'] < 0 ||  query['checks'] < 0)  
    throw Error("All values must be greater than or equal to 0." );
    
  var charge = 0;
  var checksBal = parseInt(query['checkBal']);
  var savingsBal = parseInt(query['savingsBal']);
  var checks = parseInt(query['checks']);
  
  if(checksBal > 1000 || savingsBal > 1500)
  {
    charge = 0;
  }
  else
  {
      charge = checks * .15;
  }
    
  var result = {'charge' : charge}; 
  return result;
}
