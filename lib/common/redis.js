'use strict';
const Redis = require('ioredis');
let client;
function initClient(option){
    const defaultOption={
        port: 6379,
        host: '127.0.0.1'
    }
    client=new Redis(Object.assign({},defaultOption,option));
    return client;
}
module.exports=function(option){
    if(client) return client;
    return initClient(option);
}