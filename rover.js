
const READY = 'READY';
const WAITING = 'WAITING';
const DONE = 'DONE';

const rovers = [
  {
    position: [0, 0],
    heading: 'N',
    name: 'roverOne',
    commands: ['f', 'f', 'f', 'f', 'f', 'r', 'f', 'f'],
    commandIndex: 0,
    status: READY,
    message: ''
  },
  {
    position: [9, 9],
    heading: 'S',
    name: 'roverTwo',
    commands: ['f', 'f', 'f', 'f', 'f', 'r', 'f', 'f'],
    commandIndex: 0,
    status: READY,
    message: ''
  }

];



const obstacles = [
  [3, 0],
  [9, 7]
];

// order matters
// presumes starting at north and moving clockwise like a compass
const headings = ['N', 'E', 'S', 'W'];

const WIDTH = 10;
const HEIGHT = 10; 

function goForward(rover) {

  let nextPosition = [rover.position[0], rover.position[1]];

  const movementInfo = {
    'N': [0, 1],
    'E': [1, 1],
    'S': [0, WIDTH - 1],
    'W': [1, WIDTH - 1]
  };

  let posIndex = movementInfo[rover.heading][0];
  let addend = movementInfo[rover.heading][1];

  nextPosition[posIndex] = (nextPosition[posIndex] + addend) % WIDTH;

  obstacles.forEach(obstacle => {
    if (obstacle[0] === nextPosition[0] && obstacle[1] === nextPosition[1]) {
      rover.status = DONE;
      rover.message = 'Will hit rock';
    }
  });

  if (rover.status !== DONE) {

    rover.position = nextPosition;
  }

}

function getHeading(curHeading, turn) {



  let headingIndex = headings.indexOf(curHeading);
  let headingCount = headings.length;

  switch (turn) {

    case 'r':

      headingIndex = (headingIndex + 1) % headingCount;

      break;

    case 'l':

      headingIndex = (headingIndex + headingCount - 1) % headingCount;

      break;

    case 'b':

      headingIndex = (headingIndex + headingCount / 2) % headingCount;

      break;
  }

  return headings[headingIndex];
}

function obeyCommand(cmd, rover) {

  switch (cmd) {

    case 'f':

      goForward(rover);

      break;

    case 'b':

      rover.heading = getHeading(rover.heading, cmd);

      goForward(rover);

      break;

    case 'r':
    case 'l':

      rover.heading = getHeading(rover.heading, cmd);

      break;
  }

}


function startMission(rovers) {

  var hud = document.getElementById("hud");

  while (rovers[0].status !== DONE || rovers[1].status !== DONE) {

    for (let r = 0; r < rovers.length; r++) {

      let rover = rovers[r];

      if (rover.status !== DONE) {
        let command = rover.commands[rover.commandIndex];

        hud.innerHTML = hud.innerHTML + `<br> ${rover.name}  current position [${rover.position}] heading ${rover.heading}`;

        obeyCommand(command, rover);

        if (rover.commandIndex < rover.commands.length - 1) {
          rover.commandIndex = rover.commandIndex + 1;
        } else {
          rover.status = DONE;
          rover.message = 'Mission complete';
        }

        hud.innerHTML = hud.innerHTML + ` ---  ${command} next position [${rover.position}] ${rover.message}`;

        if (rover.status === DONE) {
          hud.innerHTML = hud.innerHTML + ' all done!!!';
        }

      }

    }
  }



}

function start() {
  startMission(rovers);
}

window.onload = start;