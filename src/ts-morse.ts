interface ElmMorse {
  elm: HTMLElement | Window,
  time?: Date,
  timerId?: ReturnType<typeof setTimeout>,
  code: string[],
  cb: () => void,
  touch: boolean,
  } 

const SOS_SEQUENCE = '...---...';
const MAX_SEQUENCE_TIME = 2000; // Time before reset if no input
const CHAR_THRESHOLD = 250; // Threshold between dot (.) and dash (-)

let elmMorse: ElmMorse[] = [];
/**
 * Detect SOS morse signal from the given element.
 * @param element - The html element or window.
 * @param callback - The function called when the signal is detected.
*/
export const detectSos = (elm: HTMLElement | Window, callback: () => void): void => {
  console.log('Morse: detectSos called for', elm);

  if (elmMorse.some(em => em.elm === elm)) {
    console.warn('Element already registered');
    return;
  }

  const state: ElmMorse = {
    elm: elm,
    code: [],
    cb: callback,
    touch: false,
  };
  elmMorse.push(state);

  const resetState = (elmM: ElmMorse, reason: string) => {
    console.log(`Morse: Reset sequence (${reason})`);
    if (elmM.timerId) clearTimeout(elmM.timerId);
    elmM.time = undefined;
    elmM.code = [];
    elmM.timerId = undefined;
  };

  const morseStart = (elm: HTMLElement | Window) => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) {
      console.warn('Element not registered');
      return;
    }

    console.log('Morse: Start interaction');
    elmM.time = new Date();

    if (elmM.timerId) {
      clearTimeout(elmM.timerId);
    }
    
    elmM.timerId = setTimeout(() => {
      resetState(elmM, 'timeout during press/idle');
    }, MAX_SEQUENCE_TIME);
  }

  const morseEnd = (elm: HTMLElement | Window) => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) {
      console.warn('Element not registered');
      return;
    }

    if (!elmM.time) return;

    const diff = new Date().getTime() - elmM.time.getTime();
    console.log(`Morse: End interaction. Duration: ${diff}ms`);
    
    // Increased tolerance to 250ms
    const char = diff < CHAR_THRESHOLD ? '.' : '-';
    
    // Tentatively add to code
    const nextCode = [...elmM.code, char];
    const nextSequence = nextCode.join('');

    console.log(`Morse: Detected char: '${char}'. Sequence: ${nextSequence}`);

    // Check availability
    if (SOS_SEQUENCE === nextSequence) {
       console.log('Morse: SOS DETECTED!');
       elmM.cb();
       resetState(elmM, 'success');
       return;
    }

    // Check validity (is it a prefix?)
    if (!SOS_SEQUENCE.startsWith(nextSequence)) {
       resetState(elmM, `invalid sequence: ${nextSequence}`);
       // Optionally we could keep the last char if it matches the start of SOS, but simplest is full reset.
       // Refinement: If user typed '..-' (invalid), and tries again immediately with '.', 
       // the reset happened, so they start fresh.
       return;
    }

    // Valid prefix so far, update state
    elmM.code = nextCode;

    if (elmM.timerId) {
      clearTimeout(elmM.timerId);
    };

    // Wait for next input
    elmM.timerId = setTimeout(() => {
      resetState(elmM, 'timeout waiting for next char');
      elmM.touch = false; // Reset touch flag on idle reset
    }, MAX_SEQUENCE_TIME)
  }

  elm.addEventListener('mousedown', () => {
    // console.log('Morse: mousedown event');
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM || elmM.touch) return;
    morseStart(elm);
  });
  elm.addEventListener('touchstart', () => {
    // console.log('Morse: touchstart event');
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) return;
    elmM.touch = true;
    morseStart(elm);
  }, { passive: true });


  elm.addEventListener('mouseup', () => {
    // console.log('Morse: mouseup event');
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM || elmM.touch) return;
    morseEnd(elm);
  });
  elm.addEventListener('touchend', () => {
    // console.log('Morse: touchend event');
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) return;
    morseEnd(elm);
  }, { passive: true });
  
};