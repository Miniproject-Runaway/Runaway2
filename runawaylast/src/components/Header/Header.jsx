import reactImg from "../../assets/mainlogo.png";
import './Header.css';

const reactDescriptions = ["환영합니다.", "어서오세요.", "반갑습니다."];

function genRandomInt(max) {
  return Math.floor(Math.random() * (max + 1)); // Math.random 0이상 1미만의 무작위 부동소수점 숫자이니 +1 을 해야 max가 0이어도 floor을 통하여 0이 나올수 있는거다. 즉 배열에 맞게 0,1,2 무작위로
}

export function Header() {
  const description = reactDescriptions[genRandomInt(2)];
  return (
    <header>
      <img src={reactImg} alt="Stylized atom" />
      <h1>Runaway</h1>
      <p>
        {description} 언제 어디서든 편리하게 짐을 맡기고, 자유럽게 러닝을 시작해보세요!
      </p>
    </header>
  );
}