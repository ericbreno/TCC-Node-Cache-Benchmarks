// https://github.com/JoshuaWise/nodemark
const benchmark = require('nodemark');

const roundTo = (n, d) => Math.round(n * (10 ** d)) / (10 ** d);
const getMemmory = () => process.memoryUsage().heapUsed;

module.exports.runBenchmark = async (fn, setup = null, duration = 10000) => {
    const initialMemmory = getMemmory();

    const result = await benchmark(fn, setup, duration);
    const { error, max, min, count } = result;

    const finalMemmory = getMemmory();

    const grouped = {
        tempoMedio: result.milliseconds(4),
        margemErro: roundTo(error, 8),
        maisRapido: min,
        maisLento: max,
        execucoes: count,
        execucoesPorSegundo: result.hz(2),
        desvioPadrao: result.sd(4),
        toStr: result.toString(),
        memoriaInicial: initialMemmory,
        memoriaFinal: finalMemmory,
        memoriaUtilizada: finalMemmory - initialMemmory,
        memoriaUtilizadaMb: roundTo((finalMemmory - initialMemmory)  / 1024 / 1024, 2)
    };

    return grouped;
};