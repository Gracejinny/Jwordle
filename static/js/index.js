let attempts = 0; // 시도 횟수
let index = 0; // 인덱스 설정
let timer;

let footer = document.querySelector("footer");

function appStart() {
  const displayGameover = () => {
    // 게임 끝났음을 알려줌
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:45vw; background-color:white; width : 200px; height:100px;";
    document.body.appendChild(div);
  };

  const gameover = () => {
    // 게임 끝
    window.removeEventListener("keydown", handlekeydown);
    displayGameover();
    clearInterval(timer);
  };

  const nextLine = () => {
    // 다음줄로
    if (attempts === 6) return gameover();
    attempts += 1;
    index = 0;
  };

  const handleEnterKey = async () => {
    // 엔터키 누르기
    let 맞은_갯수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const keyboard = document.querySelector(
        `.keyboard-block[data-key='${입력한_글자}']`
      );
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
        keyboard.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#c9b458";
        keyboard.style.background = "#c9b458";
      } else block.style.background = "#787c7e";

      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = () => {
    // 백스페이스 누르기
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handlekeydown = (event) => {
    // 자판 눌렀을 때
    const key = event.key.toUpperCase(); // 대문자 표시를 위해
    const keyCode = event.keyCode; // 고유한 키코드
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  const handleclick = (event) => {
    // 마우스로 키보드 클릭
    const clickkey = event.target.dataset;
    const key = clickkey.key;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    if (key === "BACK") handleBackspace();
    else if (index === 5) {
      if (key === "ENTER") handleEnterKey();
      else return;
    } else if (key.includes) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  const startTimer = () => {
    // 타이머 표시
    const 시작_시간 = new Date();
    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handlekeydown);
  footer.addEventListener("click", handleclick);
}
appStart();
