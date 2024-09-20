interface ElmMorse {
  elm: HTMLElement,
  time?: Date,
  timerId?: ReturnType<typeof setTimeout>,
  code: string[],
  cb: () => void,
  } 

let elmMorse: ElmMorse[] = [];

/**
 * Detect SOS morse signal from the given element.
 * @param element - The html element.
 * @param callback - The function called when the signal is detected.
 */
export const detectSos = (elm: HTMLElement, cb: () => void) => {

  if (elmMorse.some(em => em.elm === elm)) {
    console.warn('Element already registered');
    return;
  }

  elmMorse.push({
    elm: elm,
    code: [],
    cb: cb,
  });

  elm.addEventListener('mousedown', () => {
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
    }, 2000)

  })


  elm.addEventListener('mouseup', () => {
  const elmM = elmMorse.find(em => em.elm === elm);
  if (!elmM) {
    console.warn('Element not registered');
    return;
  }

  if(!elmM.time) return;

  elmM.code.push(new Date().getTime() - elmM.time.getTime() < 200 ? '.' : '-');
    if(elmM.code.flat().join('') === '...---...') {
      elmM.cb();
    }

    if (elmM.timerId) {
      clearTimeout(elmM.timerId);
    };

    elmM.timerId = setTimeout(() => {
      elmM.time = undefined;
      elmM.code = [];
    }, 2000)

  })
};