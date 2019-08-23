const cachesBuilder = require('./js/cachesBuilder');
const runner = require('./js/runner');
const fs = require('fs');

const configuration = {
    // in ms
    duration: 30000,
    size: 10000,
    queries: 10,
};

const main = async () => {
    const caches = cachesBuilder.buildCaches(configuration);

    const results = {
        date: new Date(),
        configuration
    };

    for (let cache of caches) {
        const thisResult = await runner.runForCache(cache, configuration);
        
        results.keys = cache.keys;
        results[cache.name] = thisResult;
    }

    fs.writeFileSync(
        `results/s:${configuration.size}-q:${configuration.queries}-d:${configuration.duration}-${new Date().toDateString()}.json`,
        JSON.stringify(results, null, 2)
    );

    console.log('Done');
}

main().catch(console.error);