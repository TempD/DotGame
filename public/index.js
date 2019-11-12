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

  const dotColors = ['rgba(0, 0, 255, 1)', 'rgba(255, 0, 0, 1)', 'rgba(255, 165, 0, 1)', 'rgba(255, 255, 0, 1)'];
  const dotGradient = ['rgba(128, 128, 255, 1)', 'rgba(255, 128, 128, 1)', 'rgba(255, 210, 128, 1)', 'rgba(255, 255, 128, 1)'];

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
    const randomIndex = randomIntInclusive(0, 3);
    const color = dotColors[randomIndex];
    const gradient = dotGradient[randomIndex];

    dotEl.setAttribute('class', 'dot');
    dotEl.setAttribute('data-value', value);
    dotEl.setAttribute('data-diameter', diameter);
    dotEl.style.width = diameter + 'px';
    dotEl.style.border = '1px solid black';
    dotEl.style.background = `linear-gradient(${gradient}, ${color})`;
    dotEl.style.height = diameter + 'px';
    dotEl.style.left = leftPosition + 'px';
    dotEl.style.top = 0 + 'px';
    dotEl.addEventListener('click', handleDotClick);

    document.getElementById('viewport').appendChild(dotEl);
    requestAnimationFrame(() => animateDot(dotEl));
  };

  const animateDot = (el) => {
    let top = parseInt(el.style.top);
    const speed = speedStore.getState().speed;
    const viewportHeight = document.getElementById('viewport').offsetHeight;
    if (top > viewportHeight) {
      el.parentNode.removeChild(el);
      return;
    }
    setTimeout(() => {
      el.style.top = (++top) + 'px';
    }, 1000 / speed);
    requestAnimationFrame(() => animateDot(el));
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
  };
  
  window.onload = () => {
    setupGame();
    addDot();
    window.setInterval(() => addDot(), 1000);
  };
})(window);