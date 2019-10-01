const cachesBuilder = require('./js/cachesBuilder');
const runner = require('./js/runner');
const fs = require('fs');

const configuration = {
    runs: 1000,
    size: 1000000,
};

const main = async () => {
    const caches = cachesBuilder.buildCaches(configuration);

    const results = {
        date: new Date(),
        configuration
    };

    const getsSize = [1, 2, 4, 8, 16];

    for (let gets of getsSize) {
        console.log('>>>> Running for', gets, 'gets <<<<<');

        results[gets] = {};

        for (let cache of caches) {
            console.log('Running', cache.name);
            const thisResult = await runner.runForCache(cache, { ...configuration, queries: gets });

            // results.keys = cache.keys;
            results[gets][cache.name] = thisResult;
        }
    }

    fs.writeFileSync(
        `results-get/results-miss-s:${configuration.size}.json`,
        JSON.stringify(results, null)
    );

    console.log('Done');
}

main().catch(console.error);