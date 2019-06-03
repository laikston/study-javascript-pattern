/**
 * 파워케이블 패턴
 * @param {*} params 
 */
function Pattern(params) {
    this.cols = params.cols;
    this.rows = params.rows;
    this.cables = params.cables;

    /**
     * 패턴의 좌표를 x, y 만큼 쉬프트
     * @param {*} x 
     * @param {*} y 
     */
    this.getCables = function(x, y) {
        x = x || 0;
        y = y || 0;

        var cables = [];
        for(var i = 0; i < this.cables.length; i++) {
            var cable = $.extend([], this.cables[i]); // clone... 재사용 시 고유값 유지를 위해 클로닝 한다.
            if(cable.xy === undefined) {
                this.shift(cable, [x, y]);
                cables.push(cable);
            } else {                
                var pattern = patterns[cable.pattern[0]][cable.pattern[1]][cable.pattern[2]];
                var patternCables = pattern.getCables(cable.xy[0] + x, cable.xy[1] + y);
                for(var j = 0; j < patternCables.length; j++) {
                    var patternCable = $.extend([], patternCables[j]);
                    cables.push(patternCable);
                }
            }
        }
        return cables;
    }

    /**
     * 캐이블의 좌표를 x, y 만큼 쉬프트
     * @param {*} cable 
     * @param {*} position 
     */
    this.shift = function(cable, position) {
        if(position[0] + position[1] == 0) {
            return;
        }
        for(var i = 0; i < cable.length; i ++) {
            cable[i] = [cable[i][0] + position[0], cable[i][1] + position[1]];
        }
    }
}