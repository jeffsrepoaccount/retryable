/**
 * Retryable 
 *
 * Provides a mechanism to keep attempting something over and over until it is 
 * successful. Provide it a function to keep calling until it returns true, and 
 * it will keep attempting it until it does. Timeout between attempts is 
 * calculated on a logarithmic scale with an optional random variance.
 *
 * Copyright (C) 2014  Jeff Lambert
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 * 
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 */
(function(w) {
    w.Retryable = Retryable;

    //  {{{ Retryable

    function Retryable(sleepMin, sleepMax, callback, complete) {
        var self = this;
        
        self.count          = 0;
        self.maxTries       = 0;
        self.variance       = false;
        self.lastResult     = false;

        self.callback       = callback;
        self.success        = complete;
        self.call           = call;
        self.then           = then;
        self.begin          = begin;
        self.withVariance   = withVariance;
        self.max            = max;

        return self;

        //  {{{ call()

        function call(fn) {
            self.callback = fn;
            return self;
        }

        //  }}}
        //  {{{ then()

        function then(fn) {
            self.success = fn;
            return self;
        }

        //  }}}
        //  {{{ begin()

        /**
         * Starts the callback loop
         */
        function begin() {
            callbackLoop();
        }

        //  }}}
        //  {{{ withVariance()

        function withVariance() {
            self.variance = true;
            return self;
        }

        //  }}}
        //  {{{ max()

        function max(attempts) {
            self.maxTries = attempts;
            return self;
        }

        //  }}} 
        //  {{{ callbackLoop()

        /**
         * Continuously attempts to execute the callback, until the callback 
         * returns a truthy value. Aborts if maxTries attempts fail.
         *
         * If a success callback is provided, it will be called once the 
         * callback method is successful with the boolean value true as the 
         * first parameter . Having maxTries attempts fail will also notify 
         * the success callback, but with the boolean value false passed in as 
         * the first parameter.
         */
        function callbackLoop() {
            self.count++;
            var nextSleepValue = getSleepValue(self.count),
                callbackResult = self.callback(self.count, nextSleepValue);

            if(!callbackResult) {
                if(!self.maxTries || (self.count < self.maxTries)) {
                    setTimeout(function() {
                        self.lastResult = callbackLoop();
                    }, nextSleepValue);
                } 
            }

            if(self.success) {
                self.success(callbackResult);
            }

            return callbackResult;
        }

        //  }}}
        //  {{{ getSleepValue()

        /**
         * Adapted from @sth: http://stackoverflow.com/a/846249
         */
        function getSleepValue(count) {
            count = count || 0;
            var minV = Math.log(sleepMin),
                maxV = Math.log(sleepMax),
                scale = (maxV - minV) / (sleepMax - sleepMin),
                sleepTime = parseInt(
                    Math.exp(
                        minV + (scale * count)
                    )
                ) * 1000
            ;

            sleepTime += getVariance(scale);

            return sleepTime < (sleepMax*1000) ? sleepTime : sleepMax;
        }

        //  }}}
        //  {{{ getVariance()

        /**
         * Variance is a random integer between 0 and the lower 
         * sleep value bound
         */
        function getVariance(scale) {
            return !self.variance ? 0 : 
                // Generate random sign
                (Math.random() < 0.5 ? -1 : 1) * 
                // Random number between 0 and sleepMin
                Math.ceil( sleepMin * Math.random() ) * 1000
            ;
        }

        //  }}}
    }; // End Retryable

})(window);
