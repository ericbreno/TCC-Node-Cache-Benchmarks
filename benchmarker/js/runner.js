const { runBenchmark } = require('./benchmarker');

module.exports.runForCache = async ({ keys, name, cache }, { runs, queries }) => {

    let index = 0;

    const runner = () => {
        for (let i = 0; i < queries; i++) {
            cache.get(keys[index++ % keys.length]);
        }
    };

    const result = await runBenchmark(runner, null, runs);
    console.log("");

    return result;
};