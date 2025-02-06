/*
 * Copyright (c) 2025 yofukashino_
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const startSparkle = (color, amount) => {

  const mousePosition = { x: 400, y: 400, previousX: 400, previousY: 400, };
  const windowSize = { width: window.innerWidth, height: window.innerHeight };
  const scroll = { width: 0, height: 0 }


  document.addEventListener("mousemove", (event) => {
    mousePosition.x = event.pageX;
    mousePosition.y = event.pageY;
  })

  window.addEventListener("scroll", () => {
    scroll.height = window.scrollY;
    scroll.width = window.scrollX;
  });

  window.addEventListener("resize", () => {
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;
  });

  const createDiv = (height, width, style = {}) => {
    const div = document.createElement("div");
    Object.assign(div.style, {

      position: "absolute",
      height: `${height}px`,
      width: `${width}px`,
      overflow: "hidden",
      ...style
    });
    return div;
  }

  const sparkles = Array.from({ length: amount }, () => {
    const starVersion = 0;
    const tinyVersion = 0;
    const tinyDiv = createDiv(3, 3, {
      visibility: "hidden",
      zIndex: "9000",
    });
    document.body.appendChild(tinyDiv);
    const starDiv = createDiv(5, 5, {
      backgroundColor: "transparent",
      visibility: "hidden",
      zIndex: "9000"
    });
    starDiv.appendChild(createDiv(1, 5, { top: "2px", left: "0px" }));
    starDiv.appendChild(createDiv(5, 1, { top: "0px", left: "2px" }));
    document.body.appendChild(starDiv);
    return {

      star: { element: starDiv, position: {}, version: starVersion },
      tiny: { element: tinyDiv, position: {}, version: tinyVersion },
    };
  });


  const updateStar = ({ tiny, star }, index) => {
    if (--star.version == 25) star.element.style.clip = "rect(1px, 4px, 4px, 1px)";
    if (star.version) {
      star.position.y += 1 + Math.random() * 3;
      star.position.x += (index % 5 - 2) / 5;

      if (star.position.y < windowSize.height + scroll.height) {
        Object.assign(star.element.style, {
          top: `${star.position.y}px`,
          left: `${star.position.x}px`
        });
        return;
      }

      star.element.style.visibility = "hidden";
      star.version = 0;
      return;
    }

    tiny.version = amount;

    Object.assign(tiny.element.style, {
      top: `${tiny.position.y = star.position.y}px`,
      left: `${tiny.position.x = star.position.x}px`,
      width: "2px",
      height: "2px",
      backgroundColor: color,
      visibility: "visible"
    });

    star.element.style.visibility = "hidden";
  }

  const updateTiny = ({ tiny, star }, index) => {
    if (--tiny.version == 25) {
      tiny.element.style.width = "1px";
      tiny.element.style.height = "1px";
    }
    if (tiny.version) {
      tiny.position.y += 1 + Math.random() * 3;
      tiny.position.x += (index % 5 - 2) / 5;
      if (tiny.position.y < windowSize.height + scroll.height) {
        Object.assign(tiny.element.style, {
          top: `${tiny.position.y}px`,
          left: `${tiny.position.x}px`
        });
      }
      else {
        tiny.element.style.visibility = "hidden";
        tiny.version = 0;
        return;
      }
    }
    else tiny.element.style.visibility = "hidden";
  }

  const sparkle = () => {
    if (Math.abs(mousePosition.x - mousePosition.previousX) > 1 || Math.abs(mousePosition.y - mousePosition.previousY) > 1) {
      mousePosition.previousX = mousePosition.x;
      mousePosition.previousY = mousePosition.y;
      for (const { star } of sparkles) {
        if (!star.version) {
          Object.assign(star.element.style, {
            left: `${star.position.x = mousePosition.x}px`,
            top: `${star.position.y = mousePosition.y + 1}px`,
            clip: "rect(0px, 5px, 5px, 0px)",
            visibility: "visible"
          });
          star.element.childNodes.forEach((c, i) => {
            c.style.backgroundColor = color;
          });
          star.version = amount;
          break;
        }
      }
    }

    sparkles.forEach(({ tiny, star }, index) => {
      if (star.version) updateStar({ tiny, star }, index);
      if (tiny.version) updateTiny({ tiny, star }, index);
    });

    setTimeout(sparkle, 35);
  }

  requestAnimationFrame(sparkle);
}

const init = () => {
  startSparkle("rgb(255, 0, 0)", 2);
  startSparkle("rgb(0, 255, 0)", 2);
  startSparkle("rgb(0, 0, 255)", 2);
  startSparkle("rgb(255, 255, 255)", 50);
}

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}