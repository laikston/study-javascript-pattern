/**
 * 미로속에 길을 잃은 토끼를 찾기 위한 당근
 * @param {*} routes 당근경로
 */
function Carrot(routes) {
    this.routes = routes;

    this.init = function(X, Y, position, endPoint) {
        this.X = X;
        this.Y = Y;
        this.position = position;
        this.endPoint = endPoint;
    }

    this.get = function(beginPoint) {
        var x = beginPoint[0];
        var y = beginPoint[1];

        var X = this.X;
        var Y = this.Y;
        
        /*
        console.log('X = ' + this.X + ', Y = ' + this.Y);
        console.log('endPoint = ', JSON.stringify(this.endPoint));
        */

        var rabbits = [];
        rabbits.push([x, y]);

        for(var i = 0; i < this.routes.length; i++) {
            var route = routes[i];
            
            var count = 0;
            do {
                // console.log('count', count);
                if(count++ > 100) {
                    //console.log('stop...');
                    route.repeat = false;
                }

                /*if(route.until != undefined) console.log('Opps! this route has [until]');*/

                if(route.until != undefined && eval(route.until)) {
                    //console.log('rabbit arrived coner...');
                    break;
                }

                for(var j = 0; j < route.expressions.length; j++) {
                    var expression = route.expressions[j];
                    eval(expression);

                    //console.log(expression, '[' + x + ', ' + y + ']');

                    // 제자리걸음 체크
                    var lastRabbit = rabbits[rabbits.length - 1];                    
                    if(x == lastRabbit[0] && y == lastRabbit[1]) {
                        //console.log('lost rabbits..');
                        return rabbits;
                    }

                    // 경계조건 검사
                    if(x < 0) x = 0;
                    if(y < 0) y = 0;
                    if(x > this.X) x = this.X;
                    if(y > this.Y) y = this.Y;

                    rabbits.push([x, y]);
                    //console.log(JSON.stringify(rabbits));

                    if(x == this.endPoint[0] && y == this.endPoint[1]) {
                        //console.log('reached end point...');
                        return rabbits;
                    }
                }
            } while(route.repeat);
        }
        return rabbits;
    }
}