(function(w) {
    w.Retryable = Retryable;

    //  {{{ Retryable

    function Retryable(sleepMin, sleepMax, callback, complete) {
        var self = this;
        
        self.count          = 0;
        self.maxTries       = 0;
        self.variance       = false;

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

        function callbackLoop() {
            self.count++;
            var nextSleepValue = getSleepValue(self.count);

            if(!self.callback(self.count, nextSleepValue)) {
                if(self.maxTries && self.count >= self.maxTries) {
                    self.success(false);
                } else {
                    setTimeout(
                        callbackLoop, 
                        nextSleepValue
                    );
                }
            } else {
                if(self.success) {
                    self.success(true);
                }
            }
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
                Math.ceil( sleepMin * Math.random() ) * 1000
            ;
        }

        //  }}}
    }; // End Retryable

})(window);
