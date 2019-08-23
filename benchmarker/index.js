const cachesBuilder = require('./js/cachesBuilder');
const runner = require('./js/runner');
const fs = require('fs');

const configuration = {
    // in ms
    duration: 10000,
    size: 100,
    parallel: 1
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
        `results/p:${configuration.parallel}-s:${configuration.size}-d:${configuration.duration}-${new Date().toDateString()}.json`,
        JSON.stringify(results, null, 2)
    );

    console.log('Done');
}

main().catch(console.error);