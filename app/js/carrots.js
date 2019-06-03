/*
carrots[A][B]
A : rows의 개수
B : cols의 홀짝 여부, 0=짝, 1=홀
*/
var carrots = {};
carrots['0'] = {}; // rows가 3이상인 경우
carrots['1'] = {}; // rows가 1인 경우
carrots['2'] = {}; // rows가 2인 경우

carrots['1'] = {
    // rows가 짝수인 경우
    '0': new Carrot([
        {
            repeat: false,
            expressions: ['x = 0']
        }
    ])
}
carrots['1']['1'] = carrots[1][0]; // cols이 짝수, rows가 홀수인 경우 = cols짝수, rows짝수의 경우와 같음

carrots['2'] = {
    '0': new Carrot([
        {
            repeat: false,
            expressions: ['x = 0', 'y = 0', 'x = X']
        }
    ])
}
carrots['2']['1'] = carrots[2][0]; // cols이 짝수, rows가 홀수인 경우 = cols짝수, rows짝수의 경우와 같음

carrots['0'] = {
    '0': new Carrot([
        {
            repeat: false,
            expressions: ['x = 0', 'y = 0', 'x = x + 1', 'y = Y - 1']
        },
        {
            repeat: true,                
            expressions: ['x = x + 1', 'y = 0', 'x = x + 1', 'y = Y - 1']
        }
    ]),

    '1': new Carrot([
        {
            repeat: false,
            expressions: ['x = 0', 'y = 0']
        },
        {
            repeat: true,
            until: 'x == X - 2',
            expressions: ['x = x + 1', 'y = Y - 1', 'x = x + 1', 'y = 0']
            
        },
        {
            repeat: false,
            expressions: ['x = x + 1']
        },
        {
            repeat: true,
            expressions: ['x = x + 1', 'y = y + 1', 'x = x - 1', 'y = y + 1']
        }
    ])
}