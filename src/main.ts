import { detectSos } from './ts-morse';

document.addEventListener('DOMContentLoaded', () => {

  const msg = document.querySelector<HTMLDivElement>('#msg');
  const sosDiv = document.querySelector<HTMLDivElement>('.sos');

  if (!sosDiv) return;

  detectSos(sosDiv, () => {
    console.log("SOS");
    if (msg) {
      msg.innerText = "SOS detected!";
      setTimeout(() => {
        msg.innerText = "";
      }, 2000);
    }
  });
});