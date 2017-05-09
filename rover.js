
/* Mars Rover Kata
add any number of rovers to rovers array (add addtional roverPosition and roverTrail classes as needed to styles.css)
add obstacles to array
Set WIDTH or HEIGHT constants to determine size of grid
The grid has an inverted y axis so 0,0 is top left and and y position gets larger going down the screen
*/
const READY = 'READY';
const WAITING = 'WAITING';
const DONE = 'DONE';
const WIDTH = 25;
const HEIGHT = 15;
const NORTH = 'NORTH';
const EAST = 'EAST';
const SOUTH = 'SOUTH';
const WEST = 'WEST';
const LEFT = 'l';
const RIGHT = 'r';
const BACK = 'b';
const FORWARD = 'f';
const COMMAND_DELAY = 25; // milliseconds to delay commands

const rovers = [
  {
    position: [0, 0],
    heading: SOUTH,
    name: 'roverOne',
    commands: ['f', 'l', 'f', 'f', 'f', 'r', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'r', 'f', 'f'],
    commandIndex: 0,
    status: READY,
    message: '',
    colorClass: 'roverPosition1',
    trailClass: 'roverTrail1'
  },
  {
    position: [6, 8],
    heading: WEST,
    name: 'roverTwo',
    commands: ['f', 'f', 'r', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'r', 'f', 'f', 'r', 'f', 'l', 'f', 'f', 'f', 'f'],
    commandIndex: 0,
    status: READY,
    message: '',
    colorClass: 'roverPosition2',
    trailClass: 'roverTrail2'
  },
  {
    position: [9, 8],
    heading: WEST,
    name: 'roverThree',
    commands: ['f', 'f', 'r', 'f', 'f', 'f', 'f', 'f', 'l', 'f', 'f', 'f', 'b', 'f', 'f', 'r', 'f', 'f', 'r', 'f', 'l', 'f', 'f', 'f', 'f'],
    commandIndex: 0,
    status: READY,
    message: '',
    colorClass: 'roverPosition3',
    trailClass: 'roverTrail3'
  }

];

const obstacles = [
  [3, 4],
  [9, 7],
  [20, 12],
  [18, 4]
];

// go through rovers declared above and collect CSS classes for dynamic removal
const classesToRemove = rovers.reduce((acc, cur) => {
  acc.push(cur.colorClass, cur.trailClass);
  return acc;
}, []);


// order matters
// presumes starting at north and moving clockwise like a compass
const headings = [NORTH, EAST, SOUTH, WEST];



// start when it's safe
window.onload = start;

function start() {

  initGrid();

  startMission(rovers);

}

function initGrid() {

  let row = document.getElementById('row-0');

  let cell = document.getElementById("[0,0]");

  let tableBody = document.getElementById('table-body');

  // first get row 0 in shape
  for (let columnIndex = 1; columnIndex < WIDTH; columnIndex++) {

    let cellClone = cell.cloneNode();

    row.appendChild(cellClone);

    cellClone.id = `[${columnIndex},0]`;

  }

  // now clone row 0 and set ids appropriately
  for (let rowIndex = 1; rowIndex < HEIGHT; rowIndex++) {

    let newRow = row.cloneNode(true);

    tableBody.appendChild(newRow);

    let cells = newRow.getElementsByClassName('divTableCell');

    for (let columnIndex = 0; columnIndex < cells.length; columnIndex++) {

      let cellNode = cells[columnIndex];

      cellNode.id = `[${columnIndex},${rowIndex}]`;

    }

  }

  // add the obstacles
  obstacles.forEach(obstacle => {
    document.getElementById(`[${obstacle[0]},${obstacle[1]}]`).classList.add('obstacle');
  });
}

async function startMission(rovers) {

  while (rovers.some(rvr => rvr.status !== DONE)) {

    for (let r = 0; r < rovers.length; r++) {

      let rover = rovers[r];

      if (rover.status !== DONE) {

        let command = rover.commands[rover.commandIndex];

        await obeyCommand(command, rover);

        if (rover.commandIndex < rover.commands.length - 1) {
          rover.commandIndex = rover.commandIndex + 1;
        } else {
          rover.status = DONE;
          rover.message = 'Mission complete';
        }
      }
    }
  }
}


function goForward(rover) {

  const nexPositions = {
    NORTH: [rover.position[0], (rover.position[1] + (HEIGHT - 1)) % HEIGHT],
    EAST: [(rover.position[0] + (WIDTH - 1)) % WIDTH, rover.position[1]],
    SOUTH: [rover.position[0], (rover.position[1] + 1) % HEIGHT],
    WEST: [(rover.position[0] + 1) % WIDTH, rover.position[1]]
  };

  let nextPosition = nexPositions[rover.heading];

  // check for obstacles
  obstacles.forEach(obstacle => {
    if (obstacle[0] === nextPosition[0] && obstacle[1] === nextPosition[1]) {
      rover.status = DONE;
      rover.message = 'Will hit rock';
    }
  });

  let otherRovers = rovers.filter(otherRover => otherRover !== rover);

  // check for other rovers
  otherRovers.forEach(otherRover => {
    if (rover !== otherRover) {
      if (otherRover.position[0] === nextPosition[0] && otherRover.position[1] === nextPosition[1]) {
        rover.status = DONE;
        rover.message = 'Will hit other rover!';
      }
    }
  });

  if (rover.status !== DONE) {

    makeCellTrail(rover);

    rover.position = nextPosition;

  }

  colorCurrentCell(rover);

}

function makeCellTrail(rover) {

  document.getElementById(getCellIdForRover(rover)).classList.add(rover.trailClass);
}

// heading = the current direction rover is facing 
function getHeading(curHeading, turn) {

  let headingIndex = headings.indexOf(curHeading);

  let headingCount = headings.length;

  switch (turn) {

    case LEFT:

      headingIndex = (headingIndex + 1) % headingCount;

      break;

    case RIGHT:

      headingIndex = (headingIndex + headingCount - 1) % headingCount;

      break;

    case BACK:

      headingIndex = (headingIndex + headingCount / 2) % headingCount;

      break;
  }

  return headings[headingIndex];
}

// function is async to allow for nicer presentation where rover drives around over time
async function obeyCommand(cmd, rover) {

  switch (cmd) {

    case FORWARD:

      goForward(rover);

      break;

    case RIGHT:
    case LEFT:
    case BACK:

      rover.heading = getHeading(rover.heading, cmd);

      break;
  }

  // add a little delay for nice looking display
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, COMMAND_DELAY);
  });

}


function colorCurrentCell(rover) {

  let id = getCellIdForRover(rover);

  let elem = document.getElementById(id);

  elem.classList.remove(classesToRemove);

  elem.classList.add(rover.colorClass);

}

function getCellIdForRover(rover) {
  return `[${rover.position[0]},${rover.position[1]}]`;
}





