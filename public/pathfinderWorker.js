importScripts(['pathfinder.js']);

let emLoadDB = Module.cwrap("loadDB", 'number', ['array', 'number']);
let emSignup = Module.cwrap("signup", null, ['string', 'string']);
let emTrust = Module.cwrap("trust", null, ['string', 'string', 'number']);
let emTransfer = Module.cwrap("transfer", null, ['string', 'string', 'string', 'string']);
let emEdgeCount = Module.cwrap("edgeCount", 'number', []);
let emDelayEdgeUpdates = Module.cwrap("delayEdgeUpdates", null, []);
let emPerformEdgeUpdates = Module.cwrap("performEdgeUpdates", null, []);

loadDB = async function() {
  const db = await fetch('db.dat')
    .then(response => {
      return response.arrayBuffer();
    });

  var ptr = Module._malloc(db.byteLength);
  var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, db.byteLength);
  heapBytes.set(new Uint8Array(db));
  let latestblockNumber = Module._loadDB(heapBytes.byteOffset, db.byteLength);
  Module._free(ptr);
  return latestblockNumber;
};

function unformatValue(value) {
  let dot = value.indexOf('.');
  let left = value;
  let right = '';
  if (dot >= 0) {
    left = value.substring(0, dot)
    right = value.substring(dot + 1, 18)
  }

  while (right.length < 18)
    right = right + '0'

  return left + right;
}

function getPath(from, to, value) {
  try {
    if (typeof value !== "string")
      throw new Error("The value parameter must contain the transfer value in wei in BN-string format or '0'.");

    if (value === "0") {
      value = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    } else {
      value = unformatValue(value)
    }
    let parameters = JSON.stringify({"from": from, "to": to, "value": value});
    var buffer = Module._malloc(parameters.length + 1);
    Module.stringToUTF8(parameters, buffer, parameters.length + 1);
    let output = Module.UTF8ToString(Module._flow(buffer));
    Module._free(buffer);
    let data = JSON.parse(output);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// Optional:
self.addEventListener('install', function(event) {
  console.log("Pathfinder service is installing ..")
  event.waitUntil(loadDB());
  console.log("Synced");
});

self.addEventListener('activate', async function(event) {
  console.log("Pathfinder service is activating ..")
});

self.addEventListener('message', function(event) {
  switch (event?.data.call) {
    case "findPath":
    {
      console.log(`Pathfinder is searching for a path to send ${event.data.args.value} wei between ${event.data.args.from} and ${event.data.args.to}`);
      const data = getPath(event.data.args.from, event.data.args.to, event.data.args.value);

      event.ports[0].postMessage({
        error:null,
        data
      });
    }
  }
});
