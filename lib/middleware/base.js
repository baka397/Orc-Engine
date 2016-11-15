//Middleware Base Function
'use strict';
/**
 * Create middleware promise list
 * @param  {Object}   taskInputData  Task data
 * @param  {Array}    funcList       Function Array list
 * @return {Object}                  Promise object
 */
function middlewareTaskCreate(taskInputData,funcList){
    let promiseFunc=new Promise(function(resolve,reject){
        resolve(taskInputData);
    });
    if(funcList.length>0){
        //Create promise list
        funcList.forEach((func)=>{
            promiseFunc=promiseFunc.then(function(outputData){
                return new Promise(function(resolve,reject){
                    func.call(this,outputData,(err,data)=>{
                        if(err) reject(err);
                        else resolve(data);
                    });
                })
            })
        })
    }
    return promiseFunc;
}
exports.task=middlewareTaskCreate;