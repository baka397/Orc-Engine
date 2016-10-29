'use strict';
const redis=require('./lib/common/redis');
function Orc(option){
    option=option||{};
    const baseOption={
        name:'orc', //Instance name,for mulit Instance
        rankingCache:1, //"Dimension Ranking System" cache time(Day)
        resultCache:1 //"Recommender Module" result cache time(Day)
    };
    this.config=Object.assign({},baseOption,option);
    if(option.redis) this.config.redis=Object.assign({},option.redis)
    //Init redis client
    this.redis=redis(this.config.redis);
}

module.exports = Orc;