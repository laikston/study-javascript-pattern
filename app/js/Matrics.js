/**
 * 파워케이블 매트릭스
 * @param {int} cols :: 비디오월에 설치된 led 가로갯수
 * @param {int} rows :: 비디오월에 설치된 led 세로갯수 
 * @param {int} cableLength :: 해당모델 묶여져야 하는 갯수
 * @param {int} level 
 */
function Matrix(cols, rows, cableLength, level) {
    //console.log(((level === undefined) ? '' : '--> ') + 'new Matrix(' + cols + ',' + rows + ',' + cableLength + ((level === undefined) ? '' : ',' + level) + ');');
    this.cols = cols;
    this.rows = rows;
    this.cableLength = cableLength;
    this.isRoot = (level === undefined); // 루트 매트릭스 여부
    this.level = level || 0;
    this.cables = [];
//    this.data = new Array(this.cols).fill(0);
    var THIS = this;
    this.data = new Array(this.cols);
    $.each(this.data, function(_idx){
    	THIS.data[_idx] = 0;
    });
    this.patterns = patterns[this.cableLength][this.rows];

    this.getCables = function() {
        var cables = [];
        for(var i = 0; i < this.cables.length; i++) {
            var cable = this.cables[i];
            this.arrange(cable, this.level);            
            cables.push(cable);
        }
        return cables;
    }

    this.calculate = function() {
        var matrices = [];
        if(this.rows > this.cableLength && this.isRoot) {            
            var sliceCount = Math.floor(this.rows / this.cableLength);

            for(var i = 0; i < sliceCount; i++) {                
                matrices.push(this.slice(this.cableLength, this.cableLength * i));
            }

            if(this.rows % this.cableLength > 0) {
                var remains = this.rows - sliceCount * this.cableLength;
                matrices.push(this.slice(remains, this.cableLength * sliceCount));
            }
        } else {
            matrices.push(this);
        }

        for(var i = 0; i < matrices.length; i++) {
            var matrix = matrices[i];            
            var cables = matrix.mapping();

            if(!matrix.isRoot) { // 루트 매트릭스는 추가할 필요 없다.
                for(var j = 0; j < cables.length; j++) {
                    this.cables.push(cables[j]);
                }
            }
        }
    }

    this.mapping = function() {
        var position = 0;
        
        while((position + 1) <= this.cols) {            
            var balance = this.cols - position;
            var size = balance > this.cableLength ? 0 : balance;
            
            if(this.rows > 1 || this.cols % this.cableLength == 0) { // 높이가 1 이상이거나, 캐이블의 배수로 딱 떨어지는 경우, 그리고 캐이블길이가 2인 경우
                position = this.setPattern(position, size);
            } else { // 1개만 남는 경우를 배제한다.                
                var cableCount = Math.floor(this.cols / this.cableLength) + (this.cols % this.cableLength == 0 ? 0 : 1);                
                                
                // 케이블 길이를 균등하게 나눌 수 있도록 케이블 개수를 케이블 길이 보다 적도록 한다.
                while(cableCount >= this.cableLength) {                    
                    position = this.setPattern(position, size);
                    cableCount--;
                }
                
                if(cableCount > 0) { // Infinity 방지
                    size = Math.ceil((this.cols - position) / cableCount);
                    
                    for(var i = 0; i < cableCount - 1; i++) {
                        position = this.setPattern(position, size);
                    }
                    
                    position = this.setPattern(position, this.cols - size * (cableCount - 1));
                }
            }
            //console.log('position', position);
        }

        return this.getCables();
    }

    this.setPattern = function(position, patternSize) {
        // 패턴이 넘치는 경우 방지
        if(this.cols - position < patternSize) {
            patternSize = this.cols - position;
        }

        /*if(console)	console.log('setPattern : patterns[' + this.cableLength + '][' + this.rows + '][' + patternSize + '];');*/

        var pattern = this.patterns[patternSize];

        while(pattern === undefined && --patternSize > -1) {            
            pattern = this.patterns[patternSize];
        }

        //console.log('pattern', pattern.cols, pattern.rows);

        var cables = pattern.getCables(position, 0);

        for(var i = 0; i < cables.length; i++) {
            var cable = cables[i];
            this.cables.push(cable);

            //console.log(JSON.stringify(cable));
            
            for(var j = 0; j < cable.length; j++) {                
                var x = cable[j][0];
                var y = cable[j][1];
                if(y == 0) {
                    this.data[x] = 1;
                }
            }
        }

        return this.getPosition();
    },

    this.getPosition = function() {        
        for(var i = 0; i < this.data.length; i++) {
            if(this.data[i] === 0) {
                return i;
            }
        }
    }
    
    this.slice = function(rows, level) {
        return new Matrix(this.cols, rows, this.cableLength, level);
    }

    /**
     * 캐이블의 y좌표를 level 만큼 올리거나 아래위를 뒤집는다.
     * @param {*} cable      
     * @param {*} level
     */
    this.arrange = function(cable, level) {
        for(var i = 0; i < cable.length; i ++) {
            var y = (this.isRoot) ? this.rows - cable[i][1] - 1 : cable[i][1] + level;
            cable[i] = [cable[i][0], y];
        }
    }
}