// https://github.com/JoshuaWise/nodemark
const benchmark = require('nodemark');

const roundTo = (n, d) => Math.round(n * (10 ** d)) / (10 ** d);
const getMemmory = () => process.memoryUsage().heapUsed;

module.exports.runBenchmark = async (fn, setup = null, duration = 10000, runs) => {
    const initialMemmory = getMemmory();

    const result = await benchmark(fn, setup, duration, runs);
    const { error, max, min, count } = result;

    const finalMemmory = getMemmory();

    const normalizacao = 1000000;
    const tempos = result.samples.sort((a, b) => a - b).map(n => n / normalizacao);
    const tempoMedioMicSec = result.milliseconds(4);

    const erroMedio = tempos.reduce((ac, it) =>
        Math.sqrt(Math.pow(it - tempoMedioMicSec, 2)) + ac,
        0
    ) / tempos.length;

    const grouped = {
        erroMedio: roundTo(erroMedio, 4),
        tempoMedio: tempoMedioMicSec,
        maisLento: roundTo(max / normalizacao, 4),
        q1: tempos[tempos.length * 0.25],
        q2: tempos[tempos.length * 0.50],
        q3: tempos[tempos.length * 0.75],
        maisRapido: roundTo(min / normalizacao, 4),
        execucoes: count,
        execucoesPorSegundo: result.hz(2),
        desvioPadrao: result.sd(4),
        toStr: result.toString(),
        memoriaInicial: initialMemmory,
        memoriaFinal: finalMemmory,
        memoriaUtilizada: finalMemmory - initialMemmory,
        memoriaUtilizadaMb: roundTo((finalMemmory - initialMemmory) / 1024 / 1024, 2),
        tempos
    };

    console.log(`${grouped.maisRapido} \n${grouped.q1} \n${grouped.q2} \n${grouped.q3} \n${grouped.maisLento} \n${grouped.tempoMedio} \n${grouped.erroMedio}`.replace(/\./g, ','))

    return grouped;
};