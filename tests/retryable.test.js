(function() {

    describe('retryable function retryer', function() {
        var count,
            tryFn = function() {
                count++;
                return true;
            },
            fixture = new Retryable(1, 2);

        it('should continue to retry until success', function() {
            var watchCount = 0;
            count = 0;
            fixture.call(tryFn).then(function() {
                watchCount++;
                expect(count).toEqual(watchCount);
            }).begin();
        });

        it('should allow for success notification', function() {
            count = 0;

            fixture.call(tryFn).then(function(success) {
                expect(success).toEqual(true);
            }).begin();
        });

        it('should allow for maximum number of attempts', function() {
            
        });
    });
    
})();
