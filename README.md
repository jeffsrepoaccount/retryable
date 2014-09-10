# Retryable 

Provides a mechanism to keep attempting something over and over until it is 
successful. Provide it a function to keep calling until it returns true, and 
it will keep attempting it until it does all in a non-blocking manner. 
Optionally provide a maximum number attempts, a successful callback, or add 
random variance to the sleep time between callbacks.

A good use case for this would be real-time services that could, from time 
time, require restart or maintenance while clients are connected. Upon restart 
all clients would then become disconnected, and, by leveraging Retryable, 
continuously attempt to reconnect until service is restored.

The amount of time between attempts is between a user-supplied minimum and 
maximum value. Should the callback function fail multiple times, the amount of 
time between attempts will grow logarithmically until it reaches the maximum 
value.  If random variance is specified, then the amount added between each 
successive failed attempt will be between -sleepMin and +sleepMin.

The random variance added, if used, is meant to prevent a large number of 
clients from flooding the service with connection requests at the same time 
when it becomes available.

_Minified Footprint: 794 bytes_

## Usage 

```javascript
   var tryThis = function() {
        // 10 % success rate
        return (Math.rand() < 0.1 ? true : false);
    };

    var success = function(wasSuccessful) {
        if(wasSuccessful) {
            alert('success!');
        } else {
            alert('Fail! Max Tries exceeded');
        }
    };

    var sleepMin = 3,   // Sleep for a minimum of 3 and a maximum of 30 
        sleepMax = 30;  // seconds between attempts.

    var retry = new Retryable(sleepMin, sleepMax);

    // Call tryThis forever until it is successful, no 
    // notification of success.
    retry.call(tryThis)
        .begin()
    ;

    // Call until success, notify when successful.
    retry.call(tryThis)
        .then(notifyComplete)
        .begin()
    ;

    // Make a maximum of 5 attempts
    retry.call(tryThis)
        .then(notifyComplete)
        .max(5)
        .begin()
    ;

    // Keep calling forever, but with a random variance
    retry.call(tryThis)
        .withVariance()
        .then(notifyComplete)
        .begin()
    ;
```

Development
===========

Retryable uses Grunt and Karma to automate building of the distributable. Run the following commands inside of the cloned repository to get set up:

```

    $ npm install grunt
    $ npm install grunt-contrib-uglify
    $ npm install grunt-contrib-copy
    $ npm install grunt-karma

```

To build the source files, run `$ grunt build`.
