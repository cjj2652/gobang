let gobang = document.querySelector("#gobang");
let ctx = gobang.getContext("2d");
// 绘制棋盘
function Drawingboard() {
    //设置线的颜色
    ctx.strokeStyle = "black";
    for (let i = 0; i < 19; i++) {
        //纵向
        ctx.moveTo(30 + i * 30, 30);
        ctx.lineTo(30 + i * 30, 570);
        ctx.stroke();
        // 横向
        ctx.moveTo(30, 30 + i * 30);
        ctx.lineTo(570, 30 + i * 30);
        ctx.stroke();
    }
}
Drawingboard();


let wins = [];
for (let i = 0; i < 19; i++) {
    wins[i] = [];
    for (let j = 0; j < 19; j++) {
        wins[i][j] = [];
    }
}
// 赢法总数
let count = 0;
//横线赢法
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 19; j++) {
        //连成五个子
        for (let k = 0; k < 5; k++) {
            wins[i + k][j][count] = true;
        }
        count++;
    }
}
//竖线赢法
for (let i = 0; i < 19; i++) {
    for (let j = 0; j < 15; j++) {
        //连成五个子
        for (let k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}
//正斜线赢法
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        //连成五个子
        for (let k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}
//反斜线赢法
for (let i = 0; i < 15; i++) {
    for (let j = 4; j < 19; j++) {
        //连成五个子
        for (let k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}
console.log(count);

let BlackWin = [];
let WhiteWin = [];
for (let i = 0; i < count; i++) {
    BlackWin[i] = 0;
    WhiteWin[i] = 0;
}

let arr = [];
// 遍历棋盘，0表示没有棋子
for (let i = 0; i < 19; i++) {
    arr[i] = [];
    for (let j = 0; j < 19; j++) {
        arr[i][j] = 0;
    }
}


// 黑棋
let Black = true;

function drawOnStep(i, j, Black) {
    // 开始画圆
    ctx.beginPath();
    ctx.arc(30 + i * 30, 30 + j * 30, 14, 0, 2 * Math.PI);
    // 结束画圆
    ctx.closePath();

    let color = ctx.createRadialGradient(30 + i * 30 + 2, 30 + j * 30 - 2, 13,
        30 + i * 30, 30 + j * 30, 0);
    //设置棋子渐变颜色
    if (Black) {
        color.addColorStop(0, "#0A0A0A");
        color.addColorStop(1, "#636766");
    } else {
        color.addColorStop(0, "#D1D1D1");
        color.addColorStop(1, "#F9F9F9");
    }
    ctx.fillStyle = color;
    // 填充颜色
    ctx.fill();
}
let over = false;
// 添加DOM事件
gobang.addEventListener('click', function(e) {
    if (over) { return; }
    //获取点击的坐标
    let x = e.offsetX;
    let y = e.offsetY;

    let i = Math.floor(x / 30);
    let j = Math.floor(y / 30);

    if (arr[i][j] == 0) {

        drawOnStep(i, j, Black);
        arr[i][j] = 1;
        Black = !Black;
        for (let k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                BlackWin[k]++;
                // 判断胜利
                if (BlackWin[k] == 5) {
                    setTimeout('alert("恭喜！黑棋获胜,游戏结束")', 5);
                    over = true;
                }
            }
        }
        if (!over) {
            computerAI();
        }
    }

})


// 电脑操作
let computerAI = function() {

    // 定义变量
    let max = 0;
    let u = 0;
    let v = 0;

    // 储存黑子白字落子评分
    let BlackScore = [];
    let WhiteScore = [];
    for (let i = 0; i < 15; i++) {
        BlackScore[i] = [];
        WhiteScore[i] = [];
        for (let j = 0; j < 15; j++) {
            BlackScore[i][j] = 0;
            WhiteScore[i][j] = 0;
        }
    }

    // 评分方法
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            //  该点无落子
            if (arr[i][j] == 0) {
                //  遍历所有赢法
                for (let k = 0; k < count; k++) {
                    //  对包含该点的赢法 所对应的赢法统计数组进行加分 -- 说明在该点落子是有价值的 
                    if (wins[i][j][k]) {
                        // /如果黑棋在这种赢法中已有1个落子 
                        if (BlackWin[k] == 1) {
                            BlackScore[i][j] += 200;
                            // 如果黑棋在这种赢法中已有2个落子
                        } else if (BlackWin[k] == 2) {
                            BlackScore[i][j] += 400;
                            // 如果黑棋在这种赢法中已有3个落子
                        } else if (BlackWin[k] == 3) {
                            BlackScore[i][j] += 2000;
                            // 如果黑棋在这种赢法中已有4个落子
                        } else if (BlackWin[k] == 4) {
                            BlackScore[i][j] += 10000;
                        }

                        // 如果白棋在这种赢法中已有1个落子 
                        if (WhiteWin[k] == 1) {
                            WhiteScore[i][j] += 220;
                            //  如果白棋在这种赢法中已有2个落子
                        } else if (WhiteWin[k] == 2) {
                            WhiteScore[i][j] += 420;
                            //  如果白棋在这种赢法中已有3个落子
                        } else if (WhiteWin[k] == 3) {
                            WhiteScore[i][j] += 2100;
                            //  如果白棋在这种赢法中已有4个落子
                        } else if (WhiteWin[k] == 4) {
                            WhiteScore[i][j] += 20000;
                        }
                    }
                }

                //  记录价值最高分和最高价值落子点坐标
                //  优先级问题  越靠后，优先级越高*/

                //  1、拦截黑棋
                if (BlackScore[i][j] > max) {
                    max = BlackScore[i][j];
                    u = i;
                    v = j;
                    //  2、当对黑棋的拦截价值分数相同时 优先选择在拦截基础上对白棋价值分更高的点位
                } else if (BlackScore[i][j] == max) {
                    if (WhiteScore[i][j] > WhiteScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
                //  3、当行白棋和拦截黑棋价值分相同时，优先行走白棋*/
                if (WhiteScore[i][j] > max) {
                    max = WhiteScore[i][j];
                    u = i;
                    v = j;
                    //  4、当多个行走白棋的方案价值分相同时，优先选择在行走白棋基础上对黑棋拦截价值分更高的点位
                } else if (WhiteScore[i][j] == max) {
                    if (BlackScore[i][j] > BlackScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }

    //  计算机AI计算完毕 落子
    drawOnStep(u, v, false);
    //  改变落子点状态
    arr[u][v] = 2; //白棋落子
    //  胜负判定*/
    for (let k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            //  白棋在该赢法下胜利系数 + 1
            WhiteWin[k]++;
            //  黑棋不可能在该赢法下胜利
            BlackScore[k] = 6;
            if (WhiteWin[k] == 5) {
                setTimeout('alert("很遗憾，白子胜利")', 5);
                over = true;
            }
        }
    }
    //  未结束
    if (!over) {
        Black = !Black;
    }
}