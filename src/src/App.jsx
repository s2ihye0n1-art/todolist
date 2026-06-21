import { useState, useEffect } from "react";

export default function App() {
  const [availableTime, setAvailableTime] = useState(
    Number(localStorage.getItem("available")) || 360
  );

  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );

  const [brainDump, setBrainDump] = useState(
    JSON.parse(localStorage.getItem("brainDump")) || []
  );

  const [title, setTitle] = useState("");
  const [estimated, setEstimated] = useState("");

  useEffect(() => {
    localStorage.setItem("available", availableTime);
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("brainDump", JSON.stringify(brainDump));
  }, [availableTime, todos, brainDump]);

  const usedTime = todos.reduce(
    (sum, todo) => sum + todo.estimated,
    0
  );

  const addTodo = () => {
    const time = Number(estimated);

    if (!title || !time) return;

    if (usedTime + time > availableTime) {
      alert(
        "오늘 가용 시간이 부족합니다. Brain Dump로 이동합니다."
      );

      setBrainDump([
        ...brainDump,
        {
          title,
          estimated: time
        }
      ]);
    } else {
      setTodos([
        ...todos,
        {
          title,
          estimated: time,
          actual: null,
          completed: false
        }
      ]);
    }

    setTitle("");
    setEstimated("");
  };

  const completeTodo = (index) => {
    const actual = Number(
      prompt("실제 걸린 시간(분)을 입력하세요")
    );

    const updated = [...todos];

    updated[index].completed = true;
    updated[index].actual = actual;

    setTodos(updated);
  };

  const totalEstimated = todos.reduce(
    (sum, todo) => sum + todo.estimated,
    0
  );

  const totalActual = todos.reduce(
    (sum, todo) => sum + (todo.actual || 0),
    0
  );

  const errorRate =
    totalEstimated > 0
      ? (
          ((totalActual - totalEstimated) /
            totalEstimated) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="container">
      <h1>Mindful Todo</h1>

      <div className="card">
        <h2>가용 시간 설정</h2>

        <input
          type="number"
          value={availableTime}
          onChange={(e) =>
            setAvailableTime(Number(e.target.value))
          }
        />

        <p>
          사용 시간: {usedTime} / {availableTime}분
        </p>

        <progress
          value={usedTime}
          max={availableTime}
        />
      </div>

      <div className="card">
        <h2>할 일 추가</h2>

        <input
          placeholder="할 일 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="예상 시간"
          value={estimated}
          onChange={(e) =>
            setEstimated(e.target.value)
          }
        />

        <button onClick={addTodo}>
          추가
        </button>
      </div>

      <div className="card">
        <h2>오늘의 할 일</h2>

        {todos.map((todo, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                completeTodo(index)
              }
            />

            {todo.title}

            {" | "}

            예상 {todo.estimated}분

            {todo.actual &&
              ` / 실제 ${todo.actual}분`}
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Brain Dump</h2>

        {brainDump.map((item, index) => (
          <div key={index}>
            {item.title}
          </div>
        ))}
      </div>

      <div className="card">
        <h2>계획 오차 분석</h2>

        <p>예상 시간: {totalEstimated}분</p>

        <p>실제 시간: {totalActual}분</p>

        <p>오차율: {errorRate}%</p>
      </div>
    </div>
  );
}
