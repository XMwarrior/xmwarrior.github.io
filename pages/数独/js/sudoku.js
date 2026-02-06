// 生成9*9宫格
function createBoard() {
  return JSON.parse(JSON.stringify(new Array(9).fill(new Array(9).fill("."))));
}
// 生成长度为9的1~9随机数组
function randomArr9() {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9"].sort(() => Math.random() - 0.5);
}
// 先设置三个3*3数独值
function firstSetValue() {
  const firstArea = [0, 3, 6];
  firstArea.forEach(function (item) {
    const randomArr = randomArr9();
    for (let i = 0; i < 3; i++) {
      for (let r = 0; r < 3; r++) {
        board[item + i][item + r] = randomArr.pop();
      }
    }
  });
}
// 校验
function verify(row, col, val) {
  // 校验横竖轴
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === val || board[row][i] === val) {
      return false;
    }
  }
  // 校验3*3宫格
  const rect9RowIndex = row - (row % 3);
  const rect9ColIndex = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let r = 0; r < 3; r++) {
      const currntVal = board[rect9RowIndex + i][rect9ColIndex + r];
      if (currntVal === val) return false;
    }
  }
  return true;
}
// 填充数独
function fillBoard(current) {
  const row = (current / 9) | 0;
  const col = current % 9;
  if (current === 81) return true;
  if (board[row][col] !== ".") return fillBoard(current + 1);
  const randomNumbers = randomArr9();
  for (let item = 0; item < 9; item++) {
    if (verify(row, col, randomNumbers[item])) {
      board[row][col] = randomNumbers[item];
      if (fillBoard(current + 1)) return true;
      board[row][col] = ".";
    }
  }
}
// 添加DOM
function render(board) {
  var DOMArray = [];
  for (let i = 0; i < board.length; i++) {
    const element = board[i];
    for (let j = 0; j < element.length; j++) {
      const value = element[j];
      DOMArray.push(`<div class="item" id="${i}${j}">${value === "." ? "" : value}</div>`);
    }
  }
  document.getElementById("gameContainer").innerHTML = DOMArray.join("");
}
// 抠除算法-初级（全盘随机）
function cutOut0() {
  const randomBoard = board
    .map((item, i) => item.map((num, j) => "" + i + j))
    .flat()
    .sort(() => Math.random() - 0.5);
  for (let i = 0; i < randomBoard.length; i++) {
    const element = randomBoard[i].split("");
    const value = board[element[0]][element[1]];
    const isCanClear = isLimit(element[0], element[1], value);
    if (isCanClear) {
      cacheTip(element, board[element[0]][element[1]]);
      board[element[0]][element[1]] = "";
    }
  }
}
// 抠除算法-中级（间隔）
function cutOut1() {
  const randomBoard = board.map((item, i) => item.map((num, j) => "" + i + j)).flat();
  const spacingBoard = randomBoard
    .filter((item) => {
      if (Number(item[0] % 2)) {
        return Number(item) % 2;
      } else {
        return !(Number(item) % 2);
      }
    })
    .sort((prev, next) => {
      const isSameRow = prev[0] === next[0];
      if (isSameRow && Number(prev[0] % 2) && Number(next[0] % 2)) {
        return -1;
      } else {
        return 1;
      }
    });

  const others = randomBoard.filter((item) => {
    if (Number(item[0] % 2)) {
      return !Number(item) % 2;
    } else {
      return Number(item) % 2;
    }
  });
  const concatArray = spacingBoard.concat(others);
  for (let i = 0; i < concatArray.length; i++) {
    const element = concatArray[i].split("");
    const value = board[element[0]][element[1]];
    const isCanClear = isLimit(element[0], element[1], value);
    if (isCanClear) {
      cacheTip(element, board[element[0]][element[1]]);
      board[element[0]][element[1]] = "";
    }
  }
}
// 抠除算法-高级（蛇形）
function cutOut2() {
  const randomBoard = board.map((item, i) => item.map((num, j) => "" + i + j)).flat();
  randomBoard.sort((prev, next) => {
    const isSameRow = prev[0] === next[0];
    if (isSameRow && Number(prev[0] % 2) && Number(next[0] % 2)) {
      return -1;
    } else {
      return 1;
    }
  });
  for (let i = 0; i < randomBoard.length; i++) {
    const element = randomBoard[i].split("");
    const value = board[element[0]][element[1]];
    const isCanClear = isLimit(element[0], element[1], value);
    if (isCanClear) {
      cacheTip(element, board[element[0]][element[1]]);
      board[element[0]][element[1]] = "";
    }
  }
}
// 抠除算法-骨灰级（从上到下，从左到右）
function cutOut3() {
  const randomBoard = board.map((item, i) => item.map((num, j) => "" + i + j)).flat();
  for (let i = 0; i < randomBoard.length; i++) {
    const element = randomBoard[i].split("");
    const value = board[element[0]][element[1]];
    const isCanClear = isLimit(element[0], element[1], value);
    if (isCanClear) {
      cacheTip(element, board[element[0]][element[1]]);
      board[element[0]][element[1]] = "";
      console.log(1);
    }
  }
}
// 生成提示
function cacheTip(position, value) {
  tips.push({ key: position.join(""), value });
}
// 生成空白表盘
function initEmptyBoard() {
  board = createBoard();
  render(board);
}
// 生成游戏数据
function startGame(level, event) {
  // reset
  board = null;
  selectedCell = null;
  tips = [];
  resetNumberButton();
  removeCellListeners();
  // 初始表盘
  board = createBoard();
  // 设置初始值
  firstSetValue();
  // 填充完整表盘
  fillBoard(0);
  // 挖洞
  window["cutOut" + level]();
  // 显示DOM
  render(board);
  // 设置按钮选中样式
  document.querySelector(".button.active")?.classList.remove("active");
  event.target.classList.add("active");
  // 绑定Cell点击事件
  addCellListeners();
}
// 获取相关20格
function getRelateCells(id) {
  const row = id[0];
  const col = id[1];
  const cells = [];
  // 校验横竖轴
  for (let i = 0; i < 9; i++) {
    cells.push(`${i}${col}`);
    cells.push(`${row}${i}`);
  }
  // 校验3*3宫格
  const rect9RowIndex = row - (row % 3);
  const rect9ColIndex = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let r = 0; r < 3; r++) {
      cells.push(`${rect9RowIndex + i}${rect9ColIndex + r}`);
    }
  }
  const cellsSet = new Set(cells);
  cellsSet.delete(id);
  return Array.from(cellsSet);
}
// 获取value相同格
function getSameValueCells(value) {
  const cells = [];
  board.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === value) {
        cells.push(`${i}${j}`);
      }
    });
  });
  return cells;
}
// 绑定单元格事件
function addCellListeners() {
  document.getElementById("gameContainer").addEventListener("click", func);
}
// 解绑单元格事件
function removeCellListeners() {
  document.getElementById("gameContainer").removeEventListener("click", func);
}
const func = function (e) {
  if (!e.target.classList.contains("item")) return;
  const isFill = board[e.target.id[0]][e.target.id[1]];
  // 重置items样式
  const items = [...document.querySelectorAll(".item")];
  items.forEach((cell) => {
    cell.classList.remove("relate", "same", "active", "empty");
  });
  // 获取相关20格,高亮样式
  const relate20Cells = getRelateCells(e.target.id);
  relate20Cells.forEach((id) => {
    document.getElementById(id).classList.add("relate");
  });
  if (isFill) {
    // 获取value值相同的格，高亮样式
    const sameValueCells = getSameValueCells(e.target.innerHTML);
    sameValueCells.forEach((id) => {
      document.getElementById(id).classList.add("same");
    });
    // 添加当前选中样式
    e.target.classList.add("active");
    selectedCell = null;
  } else {
    // 添加可输入选中样式
    e.target.classList.add("active", "empty");
    selectedCell = e.target.id;
  }
  toggleCancelButton(!e.target.classList.contains("error"));
  toggleNumberButtons(isFill);
};
// 控制数字按键禁用状态
function toggleNumberButtons(isFill) {
  if (isFill) {
    document.getElementById("tip").setAttribute("disabled", true);
    [...document.querySelectorAll(".number-button")].forEach((item) => {
      item.setAttribute("disabled", true);
    });
  } else {
    document.getElementById("tip").removeAttribute("disabled");
    [...document.querySelectorAll(".number-button")].forEach((item) => {
      if (!item.classList.contains("hidden")) {
        item.removeAttribute("disabled");
      }
    });
  }
}
// 控制撤销按钮禁用
function toggleCancelButton(bool) {
  if (bool) {
    document.getElementById("cancel").setAttribute("disabled", true);
  } else {
    document.getElementById("cancel").removeAttribute("disabled");
  }
}
// 输入数字
function enter(number) {
  if (selectedCell) {
    const currentDOM = document.getElementById(selectedCell);
    currentDOM.innerHTML = number;
    const rightValue = tips.find((item) => item.key === selectedCell);
    if (rightValue?.value === "" + number) {
      currentDOM.classList.remove("empty", "error");
      currentDOM.classList.add("same");
      board[selectedCell[0]][selectedCell[1]] = "" + number;
      selectedCell = null;
      toggleNumberButtons(true);
      toggleCancelButton(true);
      setNumberButtonHide("" + number);
      // 获取value值相同的格，高亮样式
      const sameValueCells = getSameValueCells("" + number);
      sameValueCells.forEach((id) => {
        document.getElementById(id).classList.add("same");
      });
    } else {
      currentDOM.classList.remove("same");
      currentDOM.classList.add("empty", "error");
      toggleCancelButton(false);
      currentDOM.classList.add("hithere");
      timeout = setTimeout(() => {
        currentDOM.classList.remove("hithere");
        clearTimeout(timeout);
      }, 800);
    }
  }
}
// 显示提示
function showTip() {
  if (selectedCell) {
    const rightValue = tips.find((item) => item.key === selectedCell);
    const currentDOM = document.getElementById(selectedCell);
    currentDOM.classList.remove("empty", "error");
    currentDOM.classList.add("same");
    board[selectedCell[0]][selectedCell[1]] = "" + rightValue?.value;
    selectedCell = null;
    // 获取value值相同的格，高亮样式
    const sameValueCells = getSameValueCells("" + rightValue?.value);
    sameValueCells.forEach((id) => {
      document.getElementById(id).classList.add("same");
    });
    setNumberButtonHide("" + rightValue?.value);
    toggleNumberButtons(true);
    toggleCancelButton(true);
    currentDOM.innerHTML = rightValue?.value;
  }
}
// 擦除
function cancel() {
  if (selectedCell) {
    const currentDOM = document.getElementById(selectedCell);
    currentDOM.innerHTML = "";
    currentDOM.classList.remove("error");
  }
}
// reset number-button
function resetNumberButton() {
  [...document.querySelectorAll(".number-button")].forEach((item) => {
    item.classList.remove("hidden");
    item.removeAttribute("disabled");
  });
}
// set NumberButton hidden
function setNumberButtonHide(number) {
  const total = board.flat().filter((val) => val === number);
  if (total.length === 9) {
    document.getElementById("n" + number).setAttribute("disabled", true);
    document.getElementById("n" + number).classList.add("hidden");
  }
}
// 添加约定
function isLimit(row, col, value) {
  const copyBoard = JSON.parse(JSON.stringify(board));
  const others = "123456789".replace(value, "").split("");
  getBoardResult(0, copyBoard);
  const isOnly = copyBoard[row][col] === value;
  const canClear = others.every((num) => !verify(row, col, num));
  const isEnoughEmpty = getEnoughEmpty(row, col, 2);
  return canClear && isEnoughEmpty && isOnly;
}
function getBoardResult(current, board) {
  const row = (current / 9) | 0;
  const col = current % 9;
  if (current === 81) return true;
  if (board[row][col] !== "") return getBoardResult(current + 1, board);
  for (let item = 1; item < 10; item++) {
    if (verify(row, col, item + "")) {
      board[row][col] = item + "";
      if (getBoardResult(current + 1, board)) return true;
      board[row][col] = "";
    }
  }
}
function getEnoughEmpty(row, col, number) {
  let emptyRowNumber = 0;
  let emptyColNumber = 0;
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === "") {
      emptyRowNumber++;
    }
    if (board[i][col] === "") {
      emptyColNumber++;
    }
  }
  return emptyRowNumber + number < 9 && emptyColNumber + number < 9;
}
