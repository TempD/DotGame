((window) => {
  //////////////////////////
  //  State related code  //
  //////////////////////////
  const appState = {
    speed: 10,
    score: 0
  };

  const actions = {
    scoreUpdate: { type: 'SCOREUPDATE' },
    speedChange: { type: 'SPEEDCHANGE' }
  };

  const scoreReducer = (state = appState, action) => {
    switch (action.type) {
      case actions.scoreUpdate.type:
        return {
          score: state.score + action.value
        };

      default:
        return state;
    }
  };

  const speedReducer = (state = appState, action) => {
    switch (action.type) {
      case actions.speedChange.type:
        return {
          speed: action.value
        };
      default:
        return state;
    }
  };

  const createStore = (reducer) => {
    let listeners = [];
    let state = reducer(undefined, {});

    return {
      getState: _ => state,
      dispatch: (action) => {
        state = reducer(state, action);

        console.log(state);
        
        listeners.forEach((listener) => listener());
      },
      subscribe: (subscriber) => {
        listeners.push(subscriber);
      }
    };
  };

  const scoreStore = createStore(scoreReducer);
  const speedStore = createStore(speedReducer);

  //////////////////////////////
  //  Math utility functions  //
  //////////////////////////////

  const randomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateDotScore = (diameter) => {
    return Math.ceil(11 - (diameter * 0.1));
  };

  /////////////////////////////
  //  Dot related functions  //
  /////////////////////////////

  const handleDotClick = (e) => {
    const dotEl = e.target;
    scoreStore.dispatch({...actions.scoreUpdate, value: parseInt(dotEl.getAttribute('data-value'), 10)});
    dotEl.parentNode.removeChild(dotEl);
  };

  const addDot = () => {
    const viewportWidth = document.getElementById('viewport').offsetWidth;
    const diameter = randomIntInclusive(10, 100);
    const value = generateDotScore(diameter);
    const leftPosition = randomIntInclusive(0, (viewportWidth - 100));
    const dotEl = document.createElement('span');

    dotEl.setAttribute('class', 'dot');
    dotEl.setAttribute('data-value', value);
    dotEl.setAttribute('data-diameter', diameter);
    dotEl.style.width = diameter + 'px';
    dotEl.style.height = diameter + 'px';
    dotEl.style.left = leftPosition + 'px';
    dotEl.style.top = 0 + 'px';
    dotEl.addEventListener('click', handleDotClick);

    document.getElementById('viewport').appendChild(dotEl);
  };

  const moveDots = _ => {
    const dots = document.querySelectorAll('span.dot');

    dots.forEach((dotEl) => {
      const top = parseInt(dotEl.style.top);
      const viewportHeight = document.getElementById('viewport').offsetHeight;
      const speed = speedStore.getState().speed;

      if (top > viewportHeight) dotEl.parentNode.removeChild(dotEl);

      const updatedSpeed = top + speed;

      dotEl.style.top = updatedSpeed + 'px';
    });
  };

  ////////////////////////////////
  //  Game functions and setup  //
  ////////////////////////////////
  const setupGame = _ => {
    const gameSpeedSlider = document.getElementById('game-speed');
    const gameScoreElement = document.getElementById('score');
    const dropValue = document.getElementById('drop-value');

    gameScoreElement.innerHTML = appState.score;
    dropValue.innerHTML = appState.speed;

    gameSpeedSlider.oninput = () => {
      speedStore.dispatch({...actions.speedChange, value: parseInt(gameSpeedSlider.value)});
    };

    speedStore.subscribe(_ => {
      const state = speedStore.getState();

      dropValue.innerHTML = state.speed;
    });
    scoreStore.subscribe(_ => {
      const state = scoreStore.getState();

      gameScoreElement.innerHTML = state.score;
    });
  }

  const runGame = _ => {
    addDot();
    moveDots();
  };
  
  window.onload = () => {
    setupGame();
    addDot();
    moveDots();
    window.setInterval(() => runGame(), 1000);
  };
})(window);