interface ElmMorse {
  elm: HTMLElement,
  time?: Date,
  timerId?: ReturnType<typeof setTimeout>,
  code: string[],
  cb: () => void,
  touch: boolean,
  } 

let elmMorse: ElmMorse[] = [];
/**
 * Detect SOS morse signal from the given element.
 * @param element - The html element.
 * @param callback - The function called when the signal is detected.
*/
export const detectSos = (elm: HTMLElement, callback: () => void): void => {

  if (elmMorse.some(em => em.elm === elm)) {
    console.warn('Element already registered');
    return;
  }

  elmMorse.push({
    elm: elm,
    code: [],
    cb: callback,
    touch: false,
  });

  const morseStart = (elm: HTMLElement) => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) {
      console.warn('Element not registered');
      return;
    }

    elmM.time = new Date();

    if (elmM.timerId) {
      clearTimeout(elmM.timerId);
    };

    elmM.timerId = setTimeout(() => {
      elmM.time = undefined;
      elmM.code = [];
    }, 2000);
  }

  const morseEnd = (elm: HTMLElement) => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) {
      console.warn('Element not registered');
      return;
    }

    

    if (!elmM.time) return;

    elmM.code.push(new Date().getTime() - elmM.time.getTime() < 200 ? '.' : '-');

    if (elmM.code.flat().join('') === '...---...') {
      elmM.cb();
    }

    if (elmM.timerId) {
      clearTimeout(elmM.timerId);
    };

    elmM.timerId = setTimeout(() => {
      elmM.time = undefined;
      elmM.touch = false;
      elmM.code = [];
    }, 2000)
  }

  elm.addEventListener('mousedown', () => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM || elmM.touch) return;
    morseStart(elm);
  });
  elm.addEventListener('touchstart', () => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) return;
    elmM.touch = true;
    morseStart(elm);
  });


  elm.addEventListener('mouseup', () => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM || elmM.touch) return;
    morseEnd(elm);
  });
  elm.addEventListener('touchend', () => {
    const elmM = elmMorse.find(em => em.elm === elm);
    if (!elmM) return;
    morseEnd(elm);
  });
  
};