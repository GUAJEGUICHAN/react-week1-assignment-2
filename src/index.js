/* eslint-disable react/react-in-jsx-scope, react/jsx-filename-extension, no-unused-vars */

/* @jsx createElement */
const app = document.getElementById('app');

function createElement(tagName, props, ...children) {
  const element = document.createElement(tagName);

  Object.entries(props || {}).forEach(([key, value]) => {
    element[key.toLowerCase()] = value;
  });

  children.flat().forEach((child) => {
    if (child instanceof Node) {
      element.appendChild(child);
      return;
    }
    element.appendChild(document.createTextNode(child));
  });

  return element;
}

const operatorFunctions = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y
}

function calculater({ numberStack, accStack }) {
  if (numberStack.length === 1) {
    return numberStack[0];
  }
  for (i = 0; i < accStack.length; i++) {
    if (accStack.includes('*' || '/') && !['*', '/'].includes(accStack[i])) {
      //곱셈 나눗셈이 있는데 현재 계산할 연산자가 곱셈이나 나눗셈이 아니면 넘긴다.
      continue;
    }
    numberStack.splice(i, i + 2, operatorFunctions[accStack[i]](numberStack[i], numberStack[i + 1]));
    accStack.splice(i, i + 1);
    return calculater({ numberStack: numberStack, accStack: accStack });
  }
}



function render({ tempNumber, numberStack, accStack }) {
  function handleClickNumber(e) {
    render({
      tempNumber: tempNumber * 10 + parseInt(e.target.innerText, 10),
      numberStack: numberStack,
      accStack: accStack
    })
  }

  function handleClickAcc(e) {
    //연산자 연속 2번 입력 막는 거 구현해보기
    render({
      tempNumber: 0,
      numberStack: [...numberStack, tempNumber],
      accStack: [...accStack, e.target.innerText]
    })
  }
  function handleClickResult() {
    numberStack = [...numberStack, tempNumber];
    render({
      tempNumber: calculater({
        numberStack: numberStack,
        accStack: accStack
      }),
      numberStack: [],
      accStack: []
    })
  }
  function buttonMaker(arr, event) {
    return (
      <p>
        {arr.map((value) => (
          <button type="button" onClick={event}>
            {value}
          </button>
        ))}
      </p>
    );
  }

  const element = (
    <div>
      <div>
        {0}
      </div>
      <div>
        {buttonMaker([1, 2, 3, 4, 5, 6, 7, 8, 9, 0], handleClickNumber)}
        {buttonMaker(['+', '-', '*', '/'], handleClickAcc)}
        {buttonMaker(['='], handleClickResult)}
      </div>
    </div>
  );

  app.textContent = '';
  app.appendChild(element);
}

render({
  tempNumber: 0,
  numberStack: [],
  accStack: []
});
