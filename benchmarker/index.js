
const { runBenchmark } = require('./benchmarker');

const f = () => {
    if (Math.random() > 0.5) return;
    f();
};

console.log(runBenchmark(f));