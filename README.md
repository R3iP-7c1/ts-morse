# ts-morse

Detect when an HTML Element is clicked by SOS morse code (... --- ...)

```
detectSos: (elm: HTMLElement, callback: () => void) => void;
```
## Example

```
import { detectSos } from 'ts-morse';

detectSos(document.body, () => {
  console.log('SOS detected!')
})

```