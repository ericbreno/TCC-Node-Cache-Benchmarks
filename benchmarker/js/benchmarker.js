const Benchmark = require('benchmark');

const roundTo = (n, d) => Math.round(n * (10 ** d)) / (10 ** d);
const getMemmory = () => process.memoryUsage().heapUsed;

module.exports.runBenchmark = async (fn, setup = null, duration = 10000, runs) => {
    const result = await new Promise((res, rej) => {
        const bench = new Benchmark(fn, {
            onComplete: function (result) {
                res(result.target);
            },
            onError: function (err) {
                rej(err);
            },
            // onCycle: function(result) {
            //     console.log('>>', result.currentTarget.stats.sample.length);
            //     console.log(String(result.target));
            // },
            minSamples: runs
        });
        bench.run();
    });

    // Segundos -> Microssegundos
    const normalizacao = 1000000;
    const tempos = result.stats.sample.sort((a, b) => a - b).map(n => n * normalizacao);
    const tempoMedioMicSec = result.stats.mean * normalizacao;
    console.log(String(result));

    const erroMedio = tempos.reduce((ac, it) =>
        Math.sqrt(Math.pow(it - tempoMedioMicSec, 2)) + ac,
        0
    ) / tempos.length;

    let q1 = tempos[tempos.length * 0.25],
        q2 = tempos[tempos.length * 0.5],
        q3 = tempos[tempos.length * 0.75];
    if ((tempos.length * 0.25) % 1 != 0) {
        q1 = tempos[Math.floor(tempos.length * 0.25)] + tempos[Math.ceil(tempos.length * 0.25)];
        q1 = q1 / 2;
    }
    if ((tempos.length * 0.5) % 1 != 0) {
        q2 = tempos[Math.floor(tempos.length * 0.5)] + tempos[Math.ceil(tempos.length * 0.5)];
        q2 = q2 / 2;
    }
    if ((tempos.length * 0.75) % 1 != 0) {
        q3 = tempos[Math.floor(tempos.length * 0.75)] + tempos[Math.ceil(tempos.length * 0.75)];
        q3 = q3 / 2;
    }

    const grouped = {
        erroMedio: roundTo(erroMedio, 4),
        tempoMedio: tempoMedioMicSec,
        maisLento: roundTo(tempos[tempos.length - 1], 4),
        q1: roundTo(q1, 4),
        q2: roundTo(q2, 4),
        q3: roundTo(q3, 4),
        maisRapido: roundTo(tempos[0], 4),
        execucoes: tempos.length,
        desvioPadrao: result.stats.deviation * normalizacao,
        margemErro: result.stats.moe * normalizacao,
        tempos
    };

    console.log(`${grouped.maisRapido} \n${grouped.q1} \n${grouped.q2} \n${grouped.q3} \n${grouped.maisLento} \n${grouped.tempoMedio} \n${grouped.erroMedio}`.replace(/\./g, ','))

    return grouped;
};