const { runBenchmark } = require('./benchmarker');

module.exports.runForCache = async ({ keys, name, cache }, { duration, queries }) => {

    const runner = callback => {
        for (let i = 0; i < queries; i++) {
            keys.forEach(key => {
                cache.get(key);
            });
        }
        callback();
    };

    console.log(`Começando run para ${name}...`);
    const result = await runBenchmark(runner, null, duration);
    console.log(`Fim run...`);

    return result;
};