const { runBenchmark } = require('./benchmarker');

module.exports.runForCache = async ({ keys, name, cache }, { runs, duration, queries }) => {

    let index = 0;

    const runner = () => {
        for (let i = 0; i < queries; i++) {
            cache.get(keys[index++ % keys.length]);
        }
    };

    console.log(`Começando run para ${name}...`);
    const result = await runBenchmark(runner, null, duration, runs);
    console.log(`Fim run...`);

    return result;
};