// https://github.com/JoshuaWise/nodemark
const benchmark = require('nodemark');

const roundTo = (n, d) => Math.round(n * (10 ** d)) / (10 ** d);

module.exports.runBenchmark = (fn, setup = null, duracao = 10000) => {
    const getMemoria = () => process.memoryUsage().heapUsed;
    const memoriaInicial = getMemoria();

    const resultado = benchmark(fn, setup, duracao);
    const { error, max, min, count } = resultado;

    const memoriaFinal = getMemoria();

    const agrupado = {
        tempoMedio: resultado.milliseconds(4),
        margemErro: roundTo(error, 8),
        maisRapido: min,
        maisLento: max,
        execucoes: count,
        execucoesPorSegundo: resultado.hz(2),
        desvioPadrao: resultado.sd(4),
        toStr: resultado.toString(),
        memoriaInicial,
        memoriaFinal,
        memoriaUtilizada: memoriaFinal - memoriaInicial,
        memoriaUtilizadaMb: roundTo((memoriaFinal - memoriaInicial)  / 1024 / 1024, 2)
    };

    return agrupado;
};