let bg;
let buttons = [];
let numButtons = 33;
let buttonSize = 80;

let zoom = 2;
let lensSize = 120;

let bgOffsetY = 0;
let scrollSpeed = 0.2; // 조절 가능: 작을수록 느리게

let canvasW = 2560; //
let canvasH = 1440;

let scaledW, scaledH;

function preload() {
  bg = loadImage("asset/background.png");
}

function setup() {
  createCanvas(canvasW, canvasH);
  //createCanvas(bg.width, bg.height);

  let imgAspect = bg.width / bg.height;
  scaledW = canvasW;
  scaledH = scaledW / imgAspect;

  for (let i = 0; i < numButtons; i++) {
    let btn = createButton("Click Me");
    btn.position(random(width - buttonSize), random(height - 40));
    btn.size(buttonSize, 40);

    // 버튼 스타일
    btn.style("background", `rgba(255, 255, 255, ${random(0.5, 1.0)})`);
    btn.style("border", "1px solid #aaa");
    btn.style("border-radius", "6px");
    btn.style("box-shadow", "inset 0 0 20px #fff, 0 2px 6px rgba(244, 255, 0, 0.2)");
    btn.style("color", "#000");
    btn.style("backdrop-filter", "blur(1px)");
    btn.style("font-size", "15px");
    btn.style("transition", "transform 0.1s ease");

    btn.mousePressed(() => alert("Eternal Connection"));

    // 버튼 hover시 회전,진동 효과
    btn.elt.addEventListener("mouseenter", () => {
      btn.style("transform", "rotate(" + random(-10, 10) + "deg) translateX(" + random(-3, 3) + "px)");
    });
    btn.elt.addEventListener("mouseleave", () => {
      btn.style("transform", "none");
    });

    buttons.push(btn);
  }
}

function draw() {
  background(0); // 초기화용

  let imgAspect = bg.width / bg.height;
  let scaledW = width;
  let scaledH = width / imgAspect;

  bgOffsetY -= scrollSpeed;
  if (bgOffsetY <= -scaledH) {
    bgOffsetY = 0;
  }

  let y1 = bgOffsetY;
  let y2 = bgOffsetY + scaledH;

  image(bg, 0, y1, scaledW, scaledH);
  image(bg, 0, y2, scaledW, scaledH);

  bgOffsetY -= scrollSpeed;

  // 이미지가 완전히 올라가면 리셋 (무한 반복)
  if (bgOffsetY <= -bg.height) {
    bgOffsetY = 0;
  }

  // 위로 흐르는 효과 위해 두 장 그리기
  image(bg, 0, bgOffsetY);
  image(bg, 0, bgOffsetY + bg.height);

  //background(bg);

  // 마우스 주위로 돋보기 확대 효과 - 돋보기 부분은 gpt와 함께...
  let lensSize = 10;
  let zoom = 2;
  let sx = constrain(mouseX - lensSize / (2 * zoom), 0, bg.width - lensSize / zoom);
  let sy = constrain(mouseY - lensSize / (2 * zoom), 0, bg.height - lensSize / zoom);

  // 확대된 부분을 버퍼에 복사 후 블러 처리
  let lensBuffer = createGraphics(lensSize, lensSize);
  lensBuffer.image(bg, -sx * zoom, -sy * zoom, bg.width * zoom, bg.height * zoom);
  lensBuffer.filter(BLUR, 1);

  // 마스크용 원형 클리핑
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(mouseX, mouseY, lensSize / 2, 0, TWO_PI);
  drawingContext.clip();
  image(lensBuffer, mouseX - lensSize / 2, mouseY - lensSize / 2);
  drawingContext.restore();

  // 원형 스타일
  noFill();
  noStroke();
  ellipse(mouseX, mouseY, lensSize, lensSize);

  // 버튼 도망 로직
  for (let btn of buttons) {
    let bx = btn.position().x + buttonSize / 2;
    let by = btn.position().y + 20;
    let d = dist(mouseX, mouseY, bx, by);

    if (d < 100) {
      let moveX = random([-1, 1]) * random(30, 60);
      let moveY = random([-1, 1]) * random(30, 60);
      let newX = constrain(btn.position().x + moveX, 0, width - buttonSize);
      let newY = constrain(btn.position().y + moveY, 0, height - 40);
      btn.position(newX, newY);
    }
  }
}
