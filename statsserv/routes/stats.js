var express = require('express');
var $ = require('jquery');
var router = express.Router();

var http = require("http");
var https = require("https");
/*
 * GET userlist.
 */
router.get('/', function(req, res) {
    var endpoints = req.cluster;
    var i = endpoints.length;
    var result = {
      "renderer": "global",
      "name": "edge",
      "nodes": [
        {
          "renderer": "region",
          "name": "INTERNET",
          "class": "normal"
        }],
      "connections": []
    };
    var collected = 0;
    var updated = Date.now();

    while(i-- > 0) {
        console.log("Entering" + i);
        var cluster = endpoints[i];
        console.log(result.nodes);
        var prot = cluster.port == 443 ? https : http;
        var req = prot.request(cluster, function(inres)
        {
            var output = '';
            console.log(cluster.host + ':' + inres.statusCode);
            inres.setEncoding('utf8');

            inres.on('data', function (chunk) {
                output += chunk;
            });

            inres.on('end', function() {

              var data = JSON.parse(output);

              var keys = [];
              var j = 0;
              for(key in data) {
                j++;
                keys.push(key);
                console.log("Processing container " + key);
                result.nodes.push({
                       "renderer": "region" + j,
                       "name": key,
                       "maxVolume": 50000,
                       "class": "normal",
                       "updated": updated
                     }
                   );
                var samples = data[key];
                var lastSample = samples[samples.length -1];
                var interfaces = lastSample.network.interfaces;
                console.log("Timestamp" + lastSample.timestamp);

                console.log("#inrefarces:" + interfaces.length);
                k = interfaces.length;
                while(--k > 0) {
                  var interface = interfaces[k];
                  console.log("Interface name  " + interface.name);
                  if(interface.name === "eth0") {
                    result.connections.push(
                        {
                         "source": "INTERNET",
                         "target": key,
                         "metrics": {
                           "normal": interface.rx_packets,
                           "danger": interface.rx_errors
                         },
                         "notices": [
                         ],
                         "class": "normal"
                        }
                    );
                  }
                }
              }
              res.json(result);


//                "connections": [
//                  {
//                   "source": "INTERNET",
//                   "target": "us-east-1",
//                   "metrics": {
//                     "normal": 26037.626,
//                     "danger": 92.37
//                   },
//                   "notices": [
//                   ],
//                   "class": "normal"
//                  }
//                ]

             // result.push({
             //     "endpoint": cluster,
             //     "active_connections": result1[1],
             //     "requests": {
             //       "accepted": result2[1],
             //       "handled": result2[2],
             //       "requests": result2[3]
             //     },
             //     "connections": {
             //       "reading": result3[1],
             //       "writing": result3[2],
             //       "waiting": result3[3]
             //     }
             // });
//              console.log("---------" + result);
//              console.log("comparing " + i + " " + cluster.length + " and "+ result.length);
//              if (++collected  == endpoints.length) {
//                res.json(result);
//              }

                //var obj = JSON.parse(output);
                //onResult(inres.statusCode, obj);
            });
        });

        req.on('error', function(err) {
            //res.send('error: ' + err.message);
        });

        req.end();
    }
    console.log("---------i " + result); 
    //res.json(cluster);
});

module.exports = router;
