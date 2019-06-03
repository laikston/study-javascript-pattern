// https://eggplantwo.github.io/2017/04/21/%EA%B0%9D%EC%B2%B4%EC%83%9D%EC%84%B1%ED%8C%A8%ED%84%B4/
function Sandbox(){
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        modules = (args[0] && typeof args[0] === 'string') ? args : args[0];

    if(!(this instanceof Sandbox)){
        return new Sandbox(modules, callback);
    }

    this.a = 1;
    this.b = 2;

    if(!modules || modules === '*' || modules[0] === '*'){
        modules = [];
        for(i in Sandbox.modules){
            if(Sandbox.modules.hasOwnProperty(i)){
                modules.push(i);
            }
        }
    }
    for(i = 0; i < modules.length; i++){
        //console.log(Sandbox.modules[modules[i]]);
        Sandbox.modules[modules[i]](this);
    }

    for(var i in Sandbox){
        if(Sandbox.hasOwnProperty(i)){
            console.log(i, Sandbox[i]);
        }
    }

    callback(this);
}
Sandbox.prototype = {
    name: 'instanceof Sandbox',
    getName: function(){
        return this.name;
    }
}
Sandbox.modules = {};
Sandbox.modules.calculate = function(box){
    box.add = function(){
        console.log('calculate :: add');
    };
    box.subtract = function(){
        console.log('calculate :: subtract');
    };
}
Sandbox.modules.data = function(box){
    box.getData = function(){
        console.log('data :: getData');
    };
    box.setData = function(){
        console.log('data :: setData');
    };
};
Sandbox(['data', 'calculate'], function(box){
    box.getData();
    box.add();
});

// function sum() {
//     console.log(arguments);
//     console.log(Array.prototype.slice.call(arguments));
//     return this;
// }
// console.log(sum.call(1, [2, 3])); 
// console.log(sum.apply(11, ['aa', 'BB']));