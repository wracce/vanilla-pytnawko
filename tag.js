"use strict";
class TagGameElement extends HTMLElement {
  cells = [];
  cellClass = "";
  powerSize = 0;
  sizeCell = 0;
  sizeBoard = 0;
  gap = 0;
  constructor() {
    super();
  }

  connectedCallback() {
    this.cellClass = this.getAttribute("cellClass");
    this.powerSize = +this.getAttribute("powerSize");
    this.gap = +this.getAttribute("gap");
    this.sizeBoard = this.clientHeight;
    this.size = this.sizeBoard / this.powerSize - this.gap;

    this.classList.add("__root_board");

    for (let i = 0; i < this.powerSize * this.powerSize; i++) {
      this.cells.push(new TagGameCellElement(i, this.size, this));

      this.insertAdjacentElement("beforeend", this.cells[i]);
      this.cells[i].style.top =
        Math.floor(i / this.powerSize) * (this.size + this.gap) +
        this.gap / 2 +
        "px";
      this.cells[i].style.left =
        (i % this.powerSize) * (this.size + this.gap) + this.gap / 2 + "px";
      this.cells[i].classList.add(this.cellClass, "__root_cell");
    }

    this.cells[this.powerSize * this.powerSize - 1].style.display = "none";
    this.cells[this.powerSize * this.powerSize - 1].id = -1;

    let rootCellId = 15; 
    let prevCellId = -1;
    let ranN = randomInteger(100,200);
    for (let i = 0; i < ranN; i++) {
      let equeueRand = [];
      if (rootCellId >= this.powerSize)
        equeueRand.push(rootCellId-this.powerSize);

      if (rootCellId < this.powerSize**2-this.powerSize)
        equeueRand.push(rootCellId+this.powerSize);

      if (rootCellId % this.powerSize !==0)
        equeueRand.push(rootCellId-1);

      if (rootCellId % this.powerSize !==this.powerSize-1)
        equeueRand.push(rootCellId+1);
      
      prevCellId = rootCellId;
      rootCellId = equeueRand[randomInteger(0,equeueRand.length-1)];
      console.log(rootCellId);
      clickCell({srcElement: this.cells[rootCellId]});
    }

    function randomInteger(min, max) {
      // случайное число от min до (max+1)
      let rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    }
  }
}
class TagGameCellElement extends HTMLElement {
  parent;
  id = -1;
  size = 0;

  constructor(id, size, parent) {
    super();
    this.parent = parent;
    this.id = id;
    this.size = size;
    this.innerText = id + 1;

    this.style.fontSize = size / 2 + "px";
    this.style.lineHeight = size + "px";
    this.style.width = size + "px";
    this.style.height = size + "px";

    this.onclick = clickCell;
  }
}
customElements.define("game-tag", TagGameElement);
customElements.define("game-tag-cell", TagGameCellElement);

let style = document.createElement("style");
style.innerHTML = `
.__root_board {
  position: relative;
  user-select: none;
}

.__root_cell {
  display: block;
  position: absolute;
  background: gray;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}
`;

document.head.appendChild(style);

function clickCell(ev) {
  let parent = ev.srcElement.parent;
  let id = parent.cells.findIndex((value) => value.id === ev.srcElement.id);
  let powerSize = parent.powerSize;

  for (const value of [id + 1, id - 1, id + powerSize, id - powerSize]) {
    if (value % powerSize < 0 || Math.abs(id%powerSize - value%powerSize) > 1) {
      continue;
    }
    if (
      Math.floor(value / powerSize) < 0 ||
      Math.floor(value / powerSize) >= powerSize
    ) {
      continue;
    }
    if (parent.cells[value].id === -1) {
      console.log(parent.cells[id].style.top,parent.cells[id].style.left);
      let bufTop = parent.cells[value].style.top;
      let bufLeft = parent.cells[value].style.left;
      parent.cells[value].style.top = parent.cells[id].style.top;
      parent.cells[value].style.left = parent.cells[id].style.left;
      parent.cells[id].style.top = bufTop;
      parent.cells[id].style.left = bufLeft;
      console.log(parent.cells[id].style.top,parent.cells[id].style.left);
      [parent.cells[value], parent.cells[id]] = [parent.cells[id], parent.cells[value]];
    }
  }
}
