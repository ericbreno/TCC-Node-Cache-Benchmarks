const { runBenchmark } = require('./benchmarker');

module.exports.runForCache = async ({ keys, name, cache }, { duration, parallel }) => {

    const runner = callback => {
        const promises = [];
        
        for (let i = 0; i < parallel; i++) {
            const promise = new Promise((res, rej) => {
                keys.forEach(key => {
                    cache.get(key);
                });
                res();
            });

            promises.push(promise);
        }

        Promise.all(promises).then(() => callback());
    };

    console.log(`Começando run para ${name}...`);
    const result = await runBenchmark(runner, null, duration);
    console.log(`Fim run...`);

    return result;
};