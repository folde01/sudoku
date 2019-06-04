!function(e){var l={};function t(o){if(l[o])return l[o].exports;var i=l[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=l,t.d=function(e,l,o){t.o(e,l)||Object.defineProperty(e,l,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,l){if(1&l&&(e=t(e)),8&l)return e;if(4&l&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&l&&"string"!=typeof e)for(var i in e)t.d(o,i,function(l){return e[l]}.bind(null,i));return o},t.n=function(e){var l=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(l,"a",l),l},t.o=function(e,l){return Object.prototype.hasOwnProperty.call(e,l)},t.p="",t(t.s=1)}([function(e,l){e.exports=class{constructor(){this.boardSize=9,this.cellDB=this.initialize(),this.regionInfo={nw:{startCellX:0,endCellX:2,startCellY:0,endCellY:2,counterpart:"se"},n:{startCellX:3,endCellX:5,startCellY:0,endCellY:2,counterpart:"s"},ne:{startCellX:6,endCellX:8,startCellY:0,endCellY:2,counterpart:"sw"},w:{startCellX:0,endCellX:2,startCellY:3,endCellY:5,counterpart:"e"},c:{startCellX:3,endCellX:5,startCellY:3,endCellY:5,counterpart:"c"},e:{startCellX:6,endCellX:8,startCellY:3,endCellY:5,counterpart:"w"},sw:{startCellX:0,endCellX:2,startCellY:6,endCellY:8,counterpart:"ne"},s:{startCellX:3,endCellX:5,startCellY:6,endCellY:8,counterpart:"n"},se:{startCellX:6,endCellX:8,startCellY:6,endCellY:8,counterpart:"nw"}},this.cellValueCounts=new Array(this.boardSize+1).fill(0),this.countCompleteCellValues=0,this.filledCellCount=0}initialize(){const e=this.boardSize;let l=new Array(e);for(let t=0;t<e;t++){l[t]=new Array(e);for(let o=0;o<e;o++)l[t][o]={cellValue:0,conflicting:!1,isClue:!0,solutionValue:null}}return l}getFilledCellCount(){return this.filledCellCount}setCellValue(e,l,t){const o=this.getCellValue(e,l);this.cellDB[l][e].cellValue=t,0===o&&t>0?this.filledCellCount++:o>0&&0===t&&this.filledCellCount--}getCellValue(e,l){return this.cellDB[l][e].cellValue}getRowValues(e){return this.cellDB[e].map(e=>e.cellValue)}getColumnValues(e){let l=[];for(let t=0;t<this.boardSize;t++)l.push(this.cellDB[t][e].cellValue);return l}getRegionValues(e){let l=[];const t=this.regionInfo[e];for(let e=t.startCellX;e<=t.endCellX;e++)for(let o=t.startCellY;o<=t.endCellY;o++)l.push(this.getCellValue(e,o));return l}setCellClueStatus(e,l,t){this.cellDB[l][e].isClue=t}getCellClueStatus(e,l){return this.cellDB[l][e].isClue}getCellSolutionValue(e,l){return this.cellDB[l][e].solutionValue}setCellSolutionValue(e,l,t){this.cellDB[l][e].solutionValue=t}removeCellSolutionValue(e,l){this.cellDB[l][e].solutionValue=null}cellIsEmpty(e,l){return 0===this.getCellValue(e,l)}getCurrentBoardValues(){return[].concat.apply([],this.cellDB.map(e=>e.cellValue))}getConflictStatus(e,l){return this.cellDB[l][e].conflicting}setConflictStatus(e,l,t){this.cellDB[l][e].conflicting=t}columnContainsCellValue(e,l){for(let t=0;t<this.boardSize;t++)if(l===this.getCellValue(e,t))return!0;return!1}getEmptyCellsInColumn(e){let l=[];for(let t=0;t<this.boardSize;t++)this.cellIsEmpty(e,t)&&l.push(t);return l}getRegionInfo(){return this.regionInfo}getCellValueCount(e){return this.cellValueCounts[e]}incrementCellValueCount(e){this.cellValueCounts[e]++,this.cellValueCounts[e]===this.boardSize&&this.countCompleteCellValues++}decrementCellValueCount(e){this.cellValueCounts[e]===this.boardSize&&this.countCompleteCellValues--,this.cellValueCounts[e]--}getCompleteCellValueCount(){return this.countCompleteCellValues}}},function(e,l,t){(new(t(2))).play()},function(e,l,t){const o=t(0),i=t(3);e.exports=class{constructor(){this.boardSize=9,this.numCells=this.boardSize*this.boardSize,this.reset()}reset(){this.cellDB=new o,this.regionInfo=this.cellDB.getRegionInfo(),this.fillDomCache()}fillDomCache(){this.domCache={},this.domCache.inputTable=document.querySelector(".inputTable"),this.domCache.inputCells=document.querySelectorAll(".inputCell"),this.domCache.newGameButton=document.querySelector(".newGame")}playInCell(e,l,t){this.cellDB.setCellValue(e,l,0),this.cellDB.setCellValue(e,l,t),this.cellDB.incrementCellValueCount(t)}getRegionCorners(e,l){const t=3*Math.floor(l/3),o=t+2,i=3*Math.floor(e/3);return{startRow:t,endRow:o,startColumn:i,endColumn:i+2}}getDomCell(e,l){const t=this.boardSize,o="#cell"+e+l;if(isNaN(e)||isNaN(l)||e>t-1||e<0||l>t-1||l<0)throw"getDomCell: unexpected cell coordinate. (cellX, cellY): "+e+", "+l;return document.querySelector(o)}removeConflictHighlighting(e,l){if(!0!==this.cellDB.getCellClueStatus(e,l))try{this.getDomCell(e,l).classList.remove("invalidMove")}catch(e){throw"removeConflictHighlighting caught exception: "+e}}addConflictHighlighting(e,l){if(!0!==this.cellDB.getCellClueStatus(e,l))try{this.getDomCell(e,l).classList.add("invalidMove")}catch(e){throw"addConflictHighlighting caught exception: "+e}}userHasSolvedPuzzle(){const e=this.boardSize;if(this.cellDB.getFilledCellCount()!==e*e)return!1;for(let l=0;l<e;l++){const t=new Set(this.cellDB.getRowValues(l)),o=new Set(this.cellDB.getColumnValues(l));if(t.size!==e||o.size!==e)return!1}for(let l in this.regionInfo)if(this.regionInfo.hasOwnProperty(l)&&new Set(this.cellDB.getRegionValues(l)).size!==e)return!1;return!0}doGameOver(){document.querySelector(".gameOver").innerText="WOOHOO YOU WON!"}hideGameOver(){document.querySelector(".gameOver").innerText=""}setCellDB(e){this.cellDB=e}play(){const e=new i;e.solve();const l=e.getCellDB();this.setCellDB(l),this.renderEmptyBoard(),this.populateBoard();const t=this.boardSize,o=document.querySelectorAll(".cell"),n=this.domCache.inputCells;n.forEach(function(e,l){l<n.length-1&&(e.innerText=(l+1).toString())});const s=this.domCache.inputTable;let r=null;const a=this;this.domCache.newGameButton.onclick=function(){a.play()},o.forEach(function(e,l){const i=l%t,c=Math.floor(l/t);0===a.cellDB.getCellValue(i,c)&&e.addEventListener("click",function(){a.removeAllConflicts(),null!==r&&o[r].classList.remove("activeCell"),o[r=l].classList.add("activeCell"),s.classList.add("inputTableActive"),n.forEach(function(l,t){const o=l.innerText,n=Number(o);l.onclick=function(){a.playInCell(i,c,n),a.highlightIfConflicting(i,c,n),e.innerText=o,e.classList.remove("activeCell"),this.deactivateKeypads(),a.userHasSolvedPuzzle()&&(console.log("solved!!!!!"),a.doGameOver())}.bind(a)})})})}deactivateKeypads(){this.domCache.inputTable.classList.remove("inputTableActive"),this.domCache.inputCells.forEach(function(e,l){e.onclick=function(){return!1}})}highlightIfConflicting(e,l,t){let o=!1;const i=this.boardSize;for(let n=0;n<i;n++)if(n!==e&&this.cellDB.getCellValue(n,l)===t){o=!0;break}if(o)return void this.setBoardConflict(e,l,!0);for(let n=0;n<i;n++)if(n!==l&&this.cellDB.getCellValue(e,n)===t){o=!0;break}if(o)return void this.setBoardConflict(e,l,!0);const n=this.getRegionCorners(e,l);for(let i=n.startColumn;i<=n.endColumn&&!o;i++)for(let s=n.startRow;s<n.endRow;s++)if((i!==e||s!==l)&&this.cellDB.getCellValue(i,s)===t){o=!0;break}o&&this.setBoardConflict(e,l,!0)}removeAllConflicts(){for(let e=0;e<this.boardSize;e++)for(let l=0;l<this.boardSize;l++)this.setBoardConflict(l,e,!1)}setBoardConflict(e,l,t){if(this.cellDB.getConflictStatus(e,l)!==t)if(this.cellDB.setConflictStatus(e,l,t),this.getDomCell(e,l),!0===t)try{this.addConflictHighlighting(e,l)}catch(e){throw"setConflictStatus caught exception: "+e}else this.removeConflictHighlighting(e,l)}renderEmptyBoard(){this.hideGameOver(),this.deactivateKeypads();const e=this.boardSize,l=document.querySelector(".board"),t=document.createElement("table");t.setAttribute("class","board");for(let l=0;l<e;l++){const o=document.createElement("tr");o.setAttribute("class","row"),t.appendChild(o);for(let t=0;t<e;t++){const e=document.createElement("td");e.setAttribute("class","cell"),e.setAttribute("id","cell"+t+l),o.appendChild(e)}}l.parentNode.replaceChild(t,l),document.querySelectorAll(".row:nth-child(3) .cell, .row:nth-child(6) .cell").forEach(function(e,l){e.classList.add("specialBottomBorder")}),document.querySelectorAll(".cell:nth-child(3), .cell:nth-child(6)").forEach(function(e,l){e.classList.add("specialRightBorder")}),["n","s","e","w"].forEach(function(e,l){const t=this.regionInfo[e];for(let e=t.startCellX;e<=t.endCellX;e++)for(let l=t.startCellY;l<=t.endCellY;l++)this.getDomCell(e,l).classList.add("checkerboardRegionCell")}.bind(this))}populateBoard(){const e=document.querySelectorAll(".cell"),l=(document.querySelectorAll(".row"),this),t=this.boardSize;e.forEach(function(e,o){const i=o%t,n=Math.floor(o/t),s=l.cellDB.getCellValue(i,n);let r=null;0===s?r="":(r=s.toString(),e.classList.add("clueCell")),e.innerText=r})}}},function(e,l,t){const o=t(0),i=t(4);e.exports=class{constructor(){Array.prototype.diff=function(e){return this.filter(function(l){return e.indexOf(l)<0})},this.boardSize=9,this.cellDB=new o,this.regionInfo=this.cellDB.getRegionInfo(),this.validMoveCount=0,this.moveAttempts=0,this.moves=[]}tryMove(e){return this.moveAttempts++,!(!this.cellDB.cellIsEmpty(e.cellX,e.cellY)||!this.moveIsValid(e)||(this.cellDB.setCellValue(e.cellX,e.cellY,e.cellValue),this.cellDB.setCellSolutionValue(e.cellX,e.cellY,e.cellValue),this.validMoveCount++,this.moves.push(e),this.cellDB.incrementCellValueCount(e.cellValue),0))}undoLastMove(){if(this.moves.length>0){const e=this.moves.pop();return e.deadEnd=!0,this.cellDB.setCellValue(e.cellX,e.cellY,0),this.cellDB.removeCellSolutionValue(e.cellX,e.cellY),this.cellDB.decrementCellValueCount(e.cellValue),e.getPreviousMove().deadEndNextMoves.push(e),e}}makeMoves(e){const l=this;e.forEach(function(e,t){l.tryMove(e)})}getMoves(){return this.moves}getCellDB(){return this.cellDB}randomInt(e,l){const t=Math.ceil(e),o=Math.floor(l);return Math.floor(Math.random()*(o-t+1))+t}solve(){this.solveByPickingRandomPossibleNextMove(),this.removeCluesFromSolvedBoard()}getPossibleNextMoves(e){let l=[];for(let t=0;t<this.boardSize;t++)t!=e.cellY&&l.push(t);let t=e.cellValue;if(this.cellDB.getCellValueCount(t)===this.boardSize&&(++t,this.cellDB.getCellValueCount(t)===this.boardSize))throw"Unexpected cell value count. Terminating.";const o=e.deadEndNextMoves.map(e=>e.cellY);let n=(e.cellX+1)%this.boardSize;return l.diff(o).map(e=>new i(n,e,t))}getLastMove(){return 0===this.moves.length?null:this.moves[this.moves.length-1]}puzzleIsComplete(){return this.cellDB.getCompleteCellValueCount()===this.boardSize}solveByPickingRandomPossibleNextMove(){let e=this.getLastMove(),l=null;for(l=e?e.cellValue:1;this.cellDB.getCellValueCount(l)<this.boardSize&&!this.puzzleIsComplete();){(e=this.getLastMove())||(e=new i(-1,-1,l));let t=this.getPossibleNextMoves(e),o=!1;for(;!o;){0===t.length&&(this.undoLastMove(),e=this.getLastMove(),t=this.getPossibleNextMoves(e));const i=this.pickRandomElementFromArray(t);(o=this.tryMove(i))?(i.setPreviousMove(e),l<this.boardSize&&l++):t.splice(t.indexOf(i),1)}}}pickRandomElementFromArray(e){return e[Math.floor(Math.random()*e.length)]}removeClue(e,l){return 0!==this.cellDB.getCellValue(e,l)&&(this.cellDB.setCellValue(e,l,0),this.cellDB.setCellClueStatus(e,l,!1),!0)}removeCluesFromSolvedBoard(e){let l;(l="dev"===e?this.removeOneClueFromSolvedBoard:this.removeCluesFromSolvedBoardMediumDifficulty).call(this)}removeOneClueFromSolvedBoard(){this.removeClue(0,0)}removeCluesFromSolvedBoardMediumDifficulty(){let e=this.boardSize*this.boardSize;const l=this.removeValuesFromCenterRegion(),t=this.boardSize-l,o=(e-=l)%2==0?35:34,i=(Math.floor((o-t)/2),["nw","w","sw","s"]);let n={nw:0,w:0,sw:0,s:0};const s=this;for(i.forEach(function(e){s.removeRandomClueFromRegionAndItsCounterpart(e),n[e]++}),e-=2*i.length;e>o;){const l=i[Math.floor(Math.random()*i.length)];n[l]<this.boardSize-1&&(this.removeRandomClueFromRegionAndItsCounterpart(l),n[l]++,e-=2)}}rotate(e){let l=-1;switch(e){case 0:l=2;break;case 1:l=1;break;case 2:l=0}return l}removeRandomClueFromRegionAndItsCounterpart(e){const l=this;let t=new Set,o=!1;for(;!o&&t.size<this.boardSize;){const i=this.regionInfo[e],n=i.startCellX,s=i.endCellX,r=i.startCellY,a=i.endCellY,c=i.counterpart,u=this.randomInt(n,s),h=this.randomInt(r,a);t.add(u.toString()+h.toString()),o=l.removeClue(u,h);const d=this.regionInfo[c],C=d.startCellX,f=(d.endCellX,d.startCellY),m=(d.endCellY,this.rotate(u%3)+C),g=this.rotate(h%3)+f;l.removeClue(m,g)}return o}removeValuesFromCenterRegion(){let e={"nw-se":[{cellX:3,cellY:3},{cellX:5,cellY:5}],"sw-ne":[{cellX:3,cellY:5},{cellX:5,cellY:3}],"e-w":[{cellX:3,cellY:4},{cellX:5,cellY:4}],"n-s":[{cellX:4,cellY:3},{cellX:4,cellY:5}],c:[{cellX:4,cellY:4}]};const l=Object.keys(e);let t=[],o=!0,i=!0;for(let e=0;e<l.length;e++){const l=Math.random()>=.5;t[e]=l,l?i=!1:o=!1}if(i||o){const e=this.randomInt(0,l.length-1);t[e]=!t[e]}const n=this;let s=0;for(let o=0;o<l.length;o++){const i=t[o],r=l[o];i&&e[r].forEach(function(e,l){n.removeClue(e.cellX,e.cellY),++s})}return s}solveByPickingRandomEmptyCellFromColumn(){for(;!this.puzzleIsComplete();){let e=null,l=null;for(let t=this.moves.slice(-1)[0].cellValue;t<=this.boardSize;t++)if(e&&(t=e,e=null),l||(l=this.cellDB.getCellValueCount(t)),l!==this.boardSize){for(let e=0;e<this.boardSize;e++){if(this.cellDB.columnContainsCellValue(e,t))continue;const l=board.cellDB.getEmptyCellsInColumn(e);let o=!0;for(;o&&l.length>0;){const n=l[Math.floor(Math.random()*l.length)],s=l.indexOf(n);l.splice(l.indexOf(s),1);const r=new i(e,n,t);this.tryMove(r)&&(o=!1)}}this.cellDB.getCellValueCount(t)<=l&&(this.undoLastMove(),e=t)}}}rowIsValid(e){let l=!0;for(let t=0;t<this.boardSize;t++)0!==this.cellDB.getCellValue(t,e.cellY)&&this.cellDB.getCellValue(t,e.cellY)===e.cellValue&&(l=!1);return l}columnIsValid(e){let l=!0;for(let t=0;t<this.boardSize;t++)0!==this.cellDB.getCellValue(e.cellX,t)&&this.cellDB.getCellValue(e.cellX,t)===e.cellValue&&(l=!1);return l}regionIsValid(e){let l=!0;const t=3*Math.floor(e.cellY/3),o=t+2,i=3*Math.floor(e.cellX/3),n=i+2;for(let s=t;s<=o;s++)for(let t=i;t<=n;t++)0!==this.cellDB.getCellValue(t,s)&&this.cellDB.getCellValue(t,s)===e.cellValue&&(l=!1);return l}moveIsValid(e){return this.rowIsValid(e)&&this.columnIsValid(e)&&this.regionIsValid(e)}}},function(e,l){e.exports=class{constructor(e,l,t,o){this.previousMove=null,this.isDeadEnd=!1,this.deadEndNextMoves=[],arguments.length<3?(this.cellX=this._getRandomInt(0,boardSize-1),this.cellY=this._getRandomInt(0,boardSize-1),this.cellValue=this._getRandomInt(1,boardSize)):arguments.length>=3&&(this.cellX=e,this.cellY=l,this.cellValue=t),4===arguments.length&&(this.previousMove=o)}setPreviousMove(e){this.previousMove=e}getPreviousMove(){return this.previousMove}_getRandomInt(e,l){return e=Math.ceil(e),l=Math.floor(l),Math.floor(Math.random()*(l-e+1))+e}}}]);