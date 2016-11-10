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
                        return data.type&&data.itemId&&data.dId&&data.point&&!isNaN(data.point)
                    }
                    catch(e){
                        return false;
                    }
                });
                if(!valid) error=new Error('Item data must have right props:type(dimension type),itemId,dId(dimension ID),point');
            }
            next(error);
        })
    },
    /**
     * Update Item to redis
     * @param  {Array}    pointArray An array for item info(Object:itemId,dId(dimension ID),point)
     * @return {Object}              Promise object
     */
    update:function(pointArray){
        let itemMiddlewares = this.getMiddlewares(pointArray);
        let redisClient = this.getRedisClient();
        return itemMiddlewares.then(datas=>{
            let redisPipeline=redisClient.pipeline();
            pointArray.forEach(pointInfo=>{
                redisPipeline.zincrby(this.getRedisKey('item:'+pointInfo.type+':'+pointInfo.itemId),pointInfo.point,pointInfo.dId);
                redisPipeline.zincrby(this.getRedisKey('dimension:'+pointInfo.type+':'+pointInfo.dId),pointInfo.point,pointInfo.itemId);
            })
            return redisPipeline.exec();
        })
    },
    /**
     * Get item from redis
     * @param  {String}   type   Type name
     * @param  {String}   itemId Item ID
     * @return {Object}          Promise object
     */
    getItem:function(type,itemId){
        let error;
        if(!type){
            error=new Error('You must specifie type when you use "getItem"');
        }
        if(!itemId){
            error=new Error('You must specifie item id when you use "getItem"');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey('item:'+type+':'+itemId);
        return redisClient.zrange(redisKey,0,-1,'withscores');
    },
    /**
     * Get dimension from redis
     * @param  {String}   type Type name
     * @param  {String}   dId  Dimension ID
     * @return {Object}        Promise object
     */
    getDimension:function(type,dId){
        let error;
        if(!type){
            error=new Error('You must specifie type when you use "getDimension"');
        }
        if(!dId){
            error=new Error('You must specifie dimension id when you use "getDimension"');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisKey = this.getRedisKey('dimension:'+type+':'+dId);
        return redisClient.zrange(redisKey,0,-1,'withscores');
    },
    /**
     * Remove dimension info from item
     * @param  {String}   type   Type name
     * @param  {String}   itemId Item ID
     * @param  {String}   dId    Dimension ID
     * @return {Object}          Promise object
     */
    removeItemDimension:function(type,itemId,dId){
        let error;
        if(!type){
            error=new Error('You must specifie type when you use "remove"');
        }
        if(!itemId){
            error=new Error('You must specifie item id when you use "remove"');
        }
        if(!dId){
            error=new Error('You must specifie dimension id when you use "remove"');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisPipeline = redisClient.pipeline();
        let redisItemKey = this.getRedisKey('item:'+type+':'+itemId);
        let redisDimensionKey = this.getRedisKey('dimension:'+type+':'+dId);
        return redisPipeline.zrem(redisItemKey,dId).zrem(redisDimensionKey,itemId).exec();
    },
    /**
     * Clear item && dimension
     * @param  {String}   type Type name
     * @param  {String} itemId Item ID
     * @return {Object}        Promise object
     */
    clearItem:function(type,itemId){
        let error;
        if(!type){
            error=new Error('You must specifie type when you use "clearItem"');
        }
        if(!itemId){
            error=new Error('You must specifie item id when you use "clearItem"');
        }
        if(error){
            return new Promise((resolve,reject)=>{
                reject(error);
            })
        }
        let redisClient = this.getRedisClient();
        let redisItemKey = this.getRedisKey('item:'+type+':'+itemId);
        //Get item key list
        return redisClient.zrange(redisItemKey,0,-1).then(result=>{
            if(result.length===0){
                return new Promise((resolve,reject)=>{
                    reject(new Error('The item ID "'+itemId+'" is not exist'))
                })
            }else{
                let redisPipeline=redisClient.pipeline();
                redisPipeline.del(redisItemKey);
                result.forEach(dId=>{
                    let redisDimensionKey = this.getRedisKey('dimension:'+type+':'+dId);
                    redisPipeline.zrem(redisDimensionKey,itemId);
                })
                return redisPipeline.exec();
            }
        })
    }
}
module.exports=itemModule;