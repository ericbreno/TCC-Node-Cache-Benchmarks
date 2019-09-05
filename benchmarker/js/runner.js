const { runBenchmark } = require('./benchmarker');

module.exports.runForCache = async ({ keys, name, cache }, { runs, duration, queries }) => {

    const runner = callback => {
        for (let i = 0; i < queries; i++) {
            keys.forEach(key => {
                cache.get(key);
            });
        }
        callback();
    };

    console.log(`Começando run para ${name}...`);
    const result = await runBenchmark(runner, null, duration, runs);
    console.log(`Fim run...`);

    return result;
};