'use strict';
exports.testStringArgument=function(argument,minLength,maxLength){
    return new RegExp('^[a-zA-Z0-9\-\_]{'+minLength+','+maxLength+'}$').test(argument);
}
exports.applyMethods=function(constructor){
    let methods=Array.prototype.slice.call(arguments, 1);
    methods.forEach((method)=>{
        Object.assign(constructor.prototype,method);
    })
}