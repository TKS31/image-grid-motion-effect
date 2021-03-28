import { gsap } from "gsap";
import { map, lerp, getMousePos, calcWinsize } from "./utils";

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener("resize", () => (winsize = calcWinsize()));

// Track the mouse position
let mousepos = { x: winsize.width / 2, y: winsize.height / 2 };
window.addEventListener("mousemove", (ev) => (mousepos = getMousePos(ev)));

export default class Grid {
  constructor(el) {
    this.DOM = { el: el };
    this.items = [...this.DOM.el.querySelectorAll(".grid__item")];
    this.showItems();
    this.move();
  }
  // Initial animation to scale up and fade in the items
  showItems() {
    gsap
      .timeline()
      .set(this.items, { scale: 0.7, opacity: 0 }, 0)
      .to(
        this.items,
        {
          duration: 2,
          ease: "Expo.easeOut",
          scale: 1,
          stagger: { amount: 0.6, grid: "auto", from: "center" }
        },
        0
      )
      .to(
        this.items,
        {
          duration: 3,
          ease: "Power1.easeOut",
          opacity: 1,
          stagger: { amount: 0.6, grid: "auto", from: "center" }
        },
        0
      );
  }

  // Move the items when moving the cursor
  move() {
    // amounts to move in each axis
    let translationVals = { tx: 0, ty: 0 };
    // get random start and end movement boundaries
    const xstart = 100;
    const ystart = 100;

    // infinite loop
    const render = () => {
      // Calculate the amount to move.
      // Using linear interpolation to smooth things out.
      // Translation values will be in the range of [-start, start] for a cursor movement from 0 to the window's width/height
      translationVals.tx = lerp(
        translationVals.tx,
        map(mousepos.x, 0, winsize.width, xstart, -xstart),
        0.07
      );
      translationVals.ty = lerp(
        translationVals.ty,
        map(mousepos.y, 0, winsize.height, ystart, -ystart),
        0.07
      );

      gsap.set(this.DOM.el, { x: translationVals.tx, y: translationVals.ty });
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
}
