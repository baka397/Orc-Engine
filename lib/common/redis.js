//Redis
'use strict';
const Redis = require('ioredis');
let redisClient;
/**
 * Init redis client
 * @param  {Object} option Redis option, for more information: https://github.com/luin/ioredis
 * @return {Object}        Redis object
 */
function initClient(option){
    const defaultOption={
        port: 6379,
        host: '127.0.0.1'
    }
    let client=new Redis(Object.assign({},defaultOption,option));
    return client;
}
module.exports=function(option){
    if(option) return initClient(option);
    else if(redisClient) return redisClient;
    else{
        redisClient=initClient(option);
        return redisClient;
    }
}