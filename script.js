let lastTouchEnd = 0;

document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // ダブルタップズーム防止
    }
    lastTouchEnd = now;
}, false);

const cells = document.querySelectorAll(".mole-cell");
let variable = 0;
let constant = 0;

const moleSVG = `
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
  <style>
    .mole { fill:#6b4f3a; }
    .belly{ fill:#7d5d45; }
    .nose { fill:#f06277; }
    .eye  { fill:#222; }
    .shine{ fill:#fff; opacity:.8; }
    .claw { fill:#e9d6c8; }
    .dirt { fill:#7a583c; }
    .shadow{ fill:#000; opacity:.12; }
  </style>
  <ellipse class="shadow" cx="150" cy="190" rx="110" ry="18"/>
  <path class="dirt" d="M40 190c18-30 60-48 110-48s92 18 110 48z"/>
  <g>
    <ellipse class="mole" cx="150" cy="120" rx="70" ry="60"/>
    <ellipse class="belly" cx="150" cy="140" rx="48" ry="34"/>
    <ellipse class="mole" cx="112" cy="68" rx="16" ry="12"/>
    <ellipse class="mole" cx="188" cy="68" rx="16" ry="12"/>
    <ellipse class="belly" cx="112" cy="68" rx="10" ry="7"/>
    <ellipse class="belly" cx="188" cy="68" rx="10" ry="7"/>
    <ellipse class="nose" cx="150" cy="112" rx="14" ry="10"/>
    <circle class="shine" cx="154" cy="108" r="3"/>
    <ellipse class="eye" cx="128" cy="105" rx="7" ry="9"/>
    <ellipse class="eye" cx="172" cy="105" rx="7" ry="9"/>
    <circle class="shine" cx="126.5" cy="102.5" r="2"/>
    <circle class="shine" cx="170.5" cy="102.5" r="2"/>
    <g stroke="#3b2b20" stroke-width="3" stroke-linecap="round" fill="none" opacity=".65">
      <path d="M95 118 L70 112"/>
      <path d="M95 124 L68 124"/>
      <path d="M95 130 L70 136"/>
      <path d="M205 118 L230 112"/>
      <path d="M205 124 L232 124"/>
      <path d="M205 130 L230 136"/>
    </g>
    <g>
      <ellipse class="mole" cx="110" cy="158" rx="20" ry="16"/>
      <ellipse class="mole" cx="190" cy="158" rx="20" ry="16"/>
      <g>
        <path class="claw" d="M97 162 l-8 9 a4 4 0 0 0 6 1z"/>
        <path class="claw" d="M104 166 l-8 9 a4 4 0 0 0 6 1z"/>
        <path class="claw" d="M111 167 l-8 9 a4 4 0 0 0 6 1z"/>
        <path class="claw" d="M118 166 l-8 9 a4 4 0 0 0 6 1z"/>
      </g>
      <g transform="matrix(-1 0 0 1 300 0)">
        <path class="claw" d="M97 162 l-8 9 a4 4 0 0 0 6 1z"/>
        <path class="claw" d="M104 166 l-8 9 a4 4 0 0 0 6 1z"/>
        <path class="claw" d="M111 167 l-8 9 a4 4 0 0 0 6 1z"/>
        <path class="claw" d="M118 166 l-8 9 a4 4 0 0 0 6 1z"/>
      </g>
    </g>
  </g>
</svg>`;

cells.forEach(cell => {
  cell.classList.add("active-cell");
})

function spawnMole() {
  document.querySelectorAll(".mole").forEach(m => m.remove());

  const moleWrapper = document.createElement("div");
  moleWrapper.classList.add("mole");
  moleWrapper.innerHTML = moleSVG;

  moleWrapper.onclick = () => {
    const field = moleWrapper.parentElement;
    if(!field.classList.contains("first-hit") && !field.classList.contains("second-hit")) {
      field.classList.add("first-hit");
      field.style.backgroundColor = "red";
    }else if(field.classList.contains("first-hit")) {
      field.classList.remove("first-hit");
      field.classList.remove("active-cell");
      field.style.backgroundColor = "black";
      if(!document.querySelector(".active-cell")) {
        stopTimer();
        const finalTime = document.getElementById('time-display').textContent;
        alert(`ゲーム終了！最終タイム: ${finalTime}`);
      }
    }
      moleWrapper.remove();
    };

    
    if(!document.querySelector(".active-cell")) {
      return;
    }else{
    const activeCells = document.querySelectorAll(".active-cell");
    const index = Math.floor(Math.random() * activeCells.length);
    activeCells[index].appendChild(moleWrapper);
  }

  const nextTime = Math.random() * variable + constant;
  setTimeout(spawnMole, nextTime);
}

document.getElementById("start-game").addEventListener("click", function() {
    // 選択された値を取得
    const selectedSpeed = document.getElementById("mole-speed").value;

    document.getElementById("speed-mode").textContent = `（${selectedSpeed}）`;

    switch (selectedSpeed) {
        case "slow":
            setMoleSpeed(1.5, 2.5);
            break;
        case "easy":
            setMoleSpeed(1.3, 2.0);
            break;
        case "normal":
            setMoleSpeed(0.9, 1.5);
            break;
        case "hard":
            setMoleSpeed(0.5, 1.0);
            break;
        case "expert":
            setMoleSpeed(0.2, 1.0);
            break;
        case "master":
            setMoleSpeed(0.1, 0.8);
            break;
        case "legend":
            setMoleSpeed(0.1, 0.5);
            break;
        case "god":
            setMoleSpeed(0.05, 0.2);
            break;
        case "impossible":
            setMoleSpeed(0.01, 0.05);
            break;
    }
});

function setMoleSpeed(min, max) {
    variable = (max - min)*1000;
    constant = min * 1000;
    spawnMole();
    startTimer();
    document.getElementById("mole-speed-container").style.display = "none";
}