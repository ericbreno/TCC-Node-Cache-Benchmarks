const cachesBuilder = require('./js/cachesBuilder');
const runner = require('./js/runner');
const fs = require('fs');

const configuration = {
    runs: 100,
    size: 1000000,
    queries: 2
};

const main = async () => {
    const caches = cachesBuilder.buildCaches(configuration);

    const results = {
        date: new Date(),
        configuration
    };

    for (let cache of caches) {
        console.log('Running', cache.name);
        const thisResult = await runner.runForCache(cache, configuration);
        
        results.keys = cache.keys;
        results[cache.name] = thisResult;
    }

    fs.writeFileSync(
        `results-miss/s:${configuration.size}-q:${configuration.queries}-r:${configuration.runs}-${new Date().toDateString()}.json`,
        JSON.stringify(results, null, 2)
    );

    console.log('Done');
}

main().catch(console.error);