import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";

class Pentagon {
  p: { x: number; y: number }; // Position
  v: { x: number; y: number }; // Velocity
  a: { x: number; y: number }; // Acceleration

  constructor(p: { x: number; y: number }, v: { x: number; y: number }, a: { x: number; y: number }) {
    this.p = p;
    this.v = v;
    this.a = a;
  }

  show(p5: any) {
    p5.fill('#FF0000'); // Set fill color to red
    p5.point(this.p.x, this.p.y);
  }

  move() {
    this.v.x += this.a.x;
    this.v.y += this.a.y;
    this.p.x += this.v.x;
    this.p.y += this.v.y;
  }

  walls(p5: any) {
    if (this.p.x >= p5.width || this.p.x <= 0) {
      this.v.x *= -1;
    }
    
    if (this.p.y >= p5.height || this.p.y <= 0) {
      this.v.y *= -1;
    }
  }

}

function sketch(p5: any) {
  let pent: Pentagon[] = [];
  const number = 10;

  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
    for (let i = 0; i < number; i++) {
      pent[i] = new Pentagon({ x: 25, y: 25 }, { x: p5.random(-5, 5), y: p5.random(-5, 5) }, { x: 0, y: 0.1 });
    }
  };
  
  p5.draw = () => {
    p5.clear();
    p5.background(252, 247, 248);
    p5.strokeWeight(5);
    for (const pen of pent) {
      pen.show(p5);
      pen.move();
      pen.walls(p5);
    }
  };
}

export function Color() {
  return (
    <div className="w-full h-screen fixed">
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}
