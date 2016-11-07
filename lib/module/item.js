//Default Module-Item
'use strict';
function itemModule(){}
itemModule.prototype={
    /**
     * Module init after module instance created
     */
    init:function(){
        //valid data middleware
        this.use(function(datas,next){
            let error;
            if(!Array.isArray(datas)) error=new Error('Item datas must be an array');
            if(!error&&datas.length===0) error=new Error('Item datas must be not empty');
            if(!error){
                let valid=datas.every(data=>{
                    try{
                        return data.itemId&&data.dId&&data.point&&!isNaN(data.point)
                    }
                    catch(e){
                        return false;
                    }
                });
                if(!valid) error=new Error('Item data must have right props:itemId,dId(dimension ID),point');
            }
            next(error);
        })
    },
    /**
     * Update Item to redis
     * @param  {Array}    pointArray An array for item info(Object:itemId,dId(dimension ID),point)
     * @return {Function}            Promise object
     */
    update:function(pointArray){
        let itemMiddlewares = this.getMiddlewares(pointArray);
        let redisClient = this.getRedisClient();
        return itemMiddlewares.then(datas=>{
            let redisPipeline=redisClient.pipeline();
            pointArray.forEach(pointInfo=>{
                redisPipeline.zincrby(this.getRedisKey('item:'+pointInfo.itemId),pointInfo.point,pointInfo.dId);
                redisPipeline.zincrby(this.getRedisKey('dimension:'+pointInfo.dId),pointInfo.point,pointInfo.itemId);
            })
            return redisPipeline.exec();
        })
    },
    /**
     * Get item from redis
     * @param  {String}   itemId Item ID
     * @return {Function}        Promise object
     */
    getItem:function(itemId){
        let error;
        if(!itemId){
            error=new Error('You must specifie item id when you use "getItem"');
        }
        if(error){
            return new Promise((resole,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey('item:'+itemId);
        return redisClient.zrange(redisKey,0,-1,'withscores');
    },
    /**
     * Get dimension from redis
     * @param  {String}   dId Dimension ID
     * @return {Function}     Promise object
     */
    getDimension:function(dId){
        let error;
        if(!dId){
            error=new Error('You must specifie dimension id when you use "getDimension"');
        }
        if(error){
            return new Promise((resole,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey('dimension:'+dId);
        return redisClient.zrange(redisKey,0,-1,'withscores');
    },
    /**
     * Remove dimension info from item
     * @param  {String}   itemId Item ID
     * @param  {String}   dId    Dimension ID
     * @return {Function}     Promise object
     */
    removeItemDimension:function(itemId,dId){
        let error;
        if(!itemId){
            error=new Error('You must specifie item id when you use "remove"');
        }
        if(!dId){
            error=new Error('You must specifie dimension id when you use "remove"');
        }
        if(error){
            return new Promise((resole,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisPipeline=redisClient.pipeline();
        let redisItemKey = this.getRedisKey('item:'+itemId);
        let redisDimensionKey = this.getRedisKey('dimension:'+dId);
        return redisPipeline.zrem(redisItemKey,dId).zrem(redisDimensionKey,itemId).exec();
    }
}
module.exports=itemModule;