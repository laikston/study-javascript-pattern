var constant = (
    function (){
        var constants = {},
            ownProp = Object.prototype.hasOwnProperty,
            allowed = {
                string: 1,
                number: 1,
                boolean: 1
            },
            prefix = (Math.random() + "_").slice(2);
        return{
            set: function(name, value){
                var flag;
                if(this.isDefined(name)){
                    flag = false;
                    console.log(flag);
                    return flag;
                }
                if(!ownProp.call(allowed, typeof value)){
                    flag = false;
                    console.log(flag);
                    return flag;
                }
                constants[prefix + name] = value;
                flag = true;
                console.log(true);
                return flag;
            },
            isDefined: function(name){
                var flag = ownProp.call(constants, prefix + name);
                console.log(flag);
                return flag;
            },
            get: function(name){
                if(this.isDefined(name)){
                    var flag = constants[prefix + name];
                    console.log(flag);
                    return flag;
                }
                return null;
            }
        }
    }
());
constant.isDefined('maxwidth');
constant.set('maxwidth', 480);
constant.isDefined('maxwidth');