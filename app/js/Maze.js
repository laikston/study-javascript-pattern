/**
 * 데이터케이블 미로 찾기
 * @param {*} cols 케비넷 가로개수
 * @param {*} rows 케비넷 세로개수
 * @param {*} width FHD구성 가로개수
 * @param {*} height FHD구성 세로개수
 * @param {*} position
 */
function Maze(cols, rows, width, height, position) {
    //console.log(((position === undefined) ? '' : '--> ') + 'new Maze(' + cols + ',' + rows + ',' + width + ',' + height + ((position === undefined) ? '' : ',' + JSON.stringify(position)) + ');');
    this.width = width;
    this.height = height;
    this.isRoot = (position === undefined); // 최상위 여부
    this.position = position || [0, 0];
    this.rabbits = [];

    // 회전여부
    if(!this.isRoot && rows > 2 &&
        ((cols <= this.height && rows <= this.width   // FHD 크기보다 회전시킨 미로의 크기보다 크고(cols <= height, rows <= width 교차 비교)
        && cols % 2 != 0 && rows % 2 == 0))) {      // 가로=홀수, 세로=짝수인 경우 이거나
        this.rolling = true;                            // 가로=짝수 패턴에 적용시키기 위해 토끼들의 좌표를 90도 CCW로 굴린다.
        this.cols = rows;
        this.rows = cols;
        //console.log('this maze was rolled...');
    } else {
        this.rolling = false;
        this.cols = cols;
        this.rows = rows;
    }

    var X = this.cols - 1, Y = this.rows - 1;
    this.beginPoint = [X, Y]; // 시작점(X, Y)
    console.log('beginPoint :: ', this.beginPoint);
    if(this.rows == 1) {
        this.endPoint = [0, 0];
    } else {
        this.endPoint = (this.cols % 2 == 0 || this.rows %2 == 0) ? [X, Y - 1] : [X - 1, Y - 1]; // 종료점(가로짝수[X, Y -1], 가로홀수[X - 1, Y - 1])
    }
    console.log('endPoint :: ', this.endPoint);
    this.carrot = $.extend({}, carrots[this.rows > 3 ? 0 : this.rows % 3][this.cols % 2]);
    console.log('carrot :: ', this.carrot);

    this.mazes = [];
    
    // 당근 초기화
    if(this.carrot !== undefined) {        
        this.carrot.init(this.cols - 1, this.rows - 1, this.position, this.endPoint);
    }

    this.run = function() {        
        var xCount = Math.floor(this.cols / this.width);
        var yCount = Math.floor(this.rows / this.height);

        if(console)	console.log('xCount = ' + xCount + ', yCount = ' + yCount);

        if(xCount == 0) { // single column
            for(var y = 0; y < yCount; y++) {                
                this.mazes.push(this.slice(this.cols, this.height, [0, y * this.height]));
            }
        } else if(yCount == 0) { // single row
            for(var x = 0; x < xCount; x++) {                
                this.mazes.push(this.slice(this.width, this.rows, [x * this.width, 0]));
            }
        } else {
            for(var x = 0; x < xCount; x++) {
                //console.log('slice x');
                for(var y = 0; y < yCount; y++) {
                    //console.log('slice y');
                    this.mazes.push(this.slice(this.width, this.height, [x * this.width, y * this.height]));
    
                    // 가로쪽 남는 여분도 잘라준다.
                    if(this.cols % this.width > 0) {
                        this.mazes.push(this.slice(this.cols - this.width * xCount, this.height, [xCount * this.width, y * this.height]));
                    }
                }
    
                // 세로쪽 남는 여분도 잘라준다.
                if(this.rows % this.height > 0) {
                	//if(this.rows % this.height == 1)	console.log(':: 세로쪽 남는 여분도 잘라준다. :: ', this.rows % this.height);
                    this.mazes.push(this.slice(this.width, this.rows - this.height * yCount, [x * this.width, yCount * this.height]));
                }
            }
            console.log('this.mazes :: ', this.mazes);
        }

        // 모서리가 있으면 그것도 자른다.
        if(this.cols % this.width > 0 && this.rows % this.height > 0) {
            //console.log('slice coner'); 
            this.mazes.push(this.slice(this.cols - this.width * xCount, this.rows - this.height * yCount, [xCount * this.width, yCount * this.height]));
        }

        

        if(this.mazes.length == 0) {
            this.mazes.push(this);
        }

        //console.log('mazes.length = ' + this.mazes.length);

        for(var i = 0; i < this.mazes.length; i++) {
            var maze = this.mazes[i];
            maze.findRabbit();
            //console.log(maze.position, 'maze[' + i + '] = ' + JSON.stringify(maze.rabbits));
            maze.shift();

            if(!maze.isRoot) {
                for(var j = 0; j < maze.rabbits.length; j++) {
                    this.rabbits.push(maze.rabbits[j]);
                }
            }
        }

        console.log(this.rabbits);

        return this.rabbits;
    }

    this.findRabbit = function() {
        if(this.cols == 1) {
            this.rabbits = [[[0, this.rows - 1], [0, 0]]];
        } else {
            this.rabbits = [this.carrot.get(this.beginPoint)];
            if(this.rolling) {
                this.rotate();
            }
        }
    }

    this.slice = function(cols, rows, position) {
        return new Maze(cols, rows, this.width, this.height, position);
    }

    /**
     * 토끼의 좌표를 x, y 만큼 쉬프트
     * @param {*} cable 
     * @param {*} position 
     */
    this.shift = function() {
        var shiftX = this.position[0];
        var shiftY = this.position[1];
        if(shiftX + shiftY == 0) {
            return;
        }

        for(var i = 0; i < this.rabbits.length; i++) {
            for(var j = 0; j < this.rabbits[i].length; j++) {
                var x = this.rabbits[i][j][0];
                var y = this.rabbits[i][j][1];
                this.rabbits[i][j] = [x + shiftX, y + shiftY];
            }
        }
    }

    /**
     * 토끼의 좌표를 90도 CCW 회전
     */
    this.rotate = function() {        
        for(var i = 0; i < this.rabbits.length; i++) {
            for(var j = 0; j < this.rabbits[i].length; j++) {
                var x = this.rabbits[i][j][0];
                var y = this.rabbits[i][j][1];
                //console.log('x', x);
                //console.log('y', y);
                this.rabbits[i][j] = [this.rows - 1 - y, x]; // x = Y - y, y = x
                //console.log('[' + x + ',' + y + '] => [' + this.rabbits[i][0] + this.rabbits[i][1] + ']');
            }
        }

        // 좌표계 전환
        var rows = this.rows;
        this.rows = this.cols;
        this.cols = rows;
    }
}