function getEditProgress(target1,target2){
        
        var transferMatrix = [],        //状态转移矩阵，用于记录每一步的变化
                len1 = target1.length,
                len2 = target2.length;

        var i,j;

        var tempMin,        //临时变量，记录当前权值
                tempProgress;        //临时变量，记录当前步骤

        // 初始化矩阵
        for(i = 0;i<=len1;i++){

                tempArr = new Array(len2+1);
                transferMatrix[i] = tempArr.slice();

        }

        // 遍历矩阵，赋值
        for(i=0; i<=len1; i++){

                for(j=0; j<=len2; j++){

                        if(!i || !j){

                                tempMin = Math.max(i,j);
                                tempProgress = {
                                        stepCount:tempMin
                                };

                        }else{

                                // 先算删除算法的编辑距离
                                tempMin = transferMatrix[i-1][j].stepCount+1;
                                tempProgress = {
                                        stepCount:tempMin,
                                        type:'delete',
                                        target1:target1[i-1],
                                        target2:target2[j-1],
                                        position1:i,
                                        position2:j,
                                        x:i-1,
                                        y:j
                                };

                                // 如果插入算法的编辑距离更小
                                if(transferMatrix[i][j-1].stepCount+1 < tempMin){

                                        tempMin = transferMatrix[i][j-1].stepCount+1;
                                        tempProgress = {
                                                stepCount:tempMin,
                                                type:'insert',
                                                target1:target1[i-1],
                                                target2:target2[j-1],
                                                position1:i,
                                                position2:j,
                                                x:i,
                                                y:j-1

                                        }
                                }

                                // 如果替换算法的编辑距离更小
                                if(transferMatrix[i-1][j-1].stepCount + (target1[i-1] === target2[j-1]?0:1) < tempMin){

                                        tempMin = transferMatrix[i-1][j-1].stepCount + (target1[i-1] === target2[j-1]?0:1);
                                        if(target1[i-1].trim() === target2[j-1].trim()){
                                                tempProgress = {
                                                        type:'copy',
                                                };
                                        }else{
                                                tempProgress = {
                                                        type:'replace',
                                                }
                                        }
                                        tempProgress.stepCount = tempMin;
                                        tempProgress.target1 = target1[i-1];
                                        tempProgress.target2 = target2[j-1];
                                        tempProgress.position1 = i;
                                        tempProgress.position2 = j;
                                        tempProgress.x = i-1;
                                        tempProgress.y = j-1;
                                
                                }

                        }

                        transferMatrix[i][j] = tempProgress;

                }

        }

        // 回溯，获取沿最短编辑距离的编辑步骤
        var progress = [];
        var currBack = transferMatrix[len1][len2];

        while(currBack.x !== undefined && currBack.y !== undefined){

                progress.unshift(currBack);

                currBack = transferMatrix[currBack.x][currBack.y];

        }

        return progress;

}