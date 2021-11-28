import React, { DragEvent, useEffect } from "react";
import { useState } from "react";
import "./App.css";
import DrawForm from "./App/components/DrawForm/DrawForm";

function App() {
  const [dnd, setdnd] = useState(false);
  const [img, setimg] = useState();
  const [width, setWidth] = useState<any>();
  const [height, setHeight] = useState<any>();

  const dragHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setdnd(true);
  };

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setdnd(false);
  };

  const handleFile = (e: any) => {
    setimg(e.target.result);
    // You can set content in state and show it in render.

  };

  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const content = e.dataTransfer.files[0];
    let fileData = new FileReader();
    fileData.onloadend = handleFile;
    fileData.readAsDataURL(content);
  };

  return (
    <div className="App">
      {img ? (
        <DrawForm img={img}/>
      ) : dnd ? (
        <div
          className="dnd-space"
          onDragStart={dragHandler}
          onDragLeave={dragLeaveHandler}
          onDragOver={dragHandler}
          onDrop={onDropHandler}
        >
          Молодец, теперь отпускай, не бойся
        </div>
      ) : (
        <div
          onDragStart={dragHandler}
          onDragLeave={dragLeaveHandler}
          onDragOver={dragHandler}
        >
          Дружище, перетащи сюда картинку
        </div>
      )}
    </div>
  );
}

export default App;
