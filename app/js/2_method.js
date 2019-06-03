if(typeof Function.prototype.method !== "function"){
    Function.prototype.method = function(name, func){
        this.prototype[name] = func;
        return this;
    }
}

var Person = function(name){
    this.name = name;
}.method('getName', function(){
    console.log(this.name);
    return this.name;
}).method('setName', function(name){
    this.name = name;
    return this;
});

var a = new Person('Adam');
a.getName();
a.setName('Eve').getName();