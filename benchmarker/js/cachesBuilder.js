const NodeCache = require("node-cache");
const LRU = require("lru-cache");
const MemoryCache = require('memory-cache');

const lodash = require('lodash');
const uuid = require('uuid');

// 10 horas
const veryLargeTimeout = 10 * 60 * 60 * 1000;

const generateKeys = (total) => {
    const list = [];
    for (let i = 0; i < total; i++) {
        list.push(uuid());
    }
    return list;
};

const populateCache = (cache, keys, inSeconds = false) => {
    const timeout = inSeconds ? veryLargeTimeout / 1000 : veryLargeTimeout;

    keys.forEach(key => {
        if (cache.set) {
            cache.set(key, key, timeout);
        } else {
            cache.put(key, key, timeout);
        }
    });
};

/**
 * Constrói e popula de forma igual os 3 caches.
 */
module.exports.buildCaches = ({ size }) => {
    const lruCache = new LRU();
    const nodeCache = new NodeCache();
    const memoryCache = new MemoryCache.Cache();

    const keys = generateKeys(size);

    populateCache(lruCache, keys);
    populateCache(nodeCache, keys);
    populateCache(memoryCache, keys, true);

    // const shuffledKeys = lodash.shuffle(keys);
    const shuffledKeys = generateKeys(size);

    return [
        { keys: shuffledKeys, name: 'lruCache', cache: lruCache },
        { keys: shuffledKeys, name: 'nodeCache', cache: nodeCache },
        { keys: shuffledKeys, name: 'memoryCache', cache: memoryCache }
    ];
};