var Gadget = (function(){
    var counter = 0,
        NewGadget;

    NewGadget = function(){
        counter += 1;
    }
    NewGadget.prototype.getLastId = function(){
        console.log(' secret static :: ', counter);
        return counter;
    }
    return NewGadget;
})();

// var g1 = new Gadget();
// var g2 = new Gadget();
// var g3 = new Gadget();
var iphone = new Gadget();
iphone.getLastId();
var ipod = new Gadget();
ipod.getLastId();
var ipad = new Gadget();
ipad.getLastId();
iphone.getLastId();