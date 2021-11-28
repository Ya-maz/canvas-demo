import { FC, useCallback, useEffect, useRef, useState } from "react";
import "./DrawForm.css";
interface typeDrawFormProps {
  img: string;
}

export const DrawForm: FC<typeDrawFormProps> = ({ img }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [newImg, setNewImg] = useState<HTMLImageElement>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [offsetArray, setOffsetX] = useState<Array<{x:number, y:number}>>([]);

  console.log(height);
  useEffect(() => {
    const newImg = new Image();
    newImg.src = img;
    newImg.onload = function () {
      setWidth(newImg.width);
      setHeight(newImg.height);
    };
    setNewImg(newImg);
  }, []);

  useEffect(() => {
    console.log("inside", width, height);
    const canvas = canvasRef.current;
    canvas!.width = width;
    canvas!.height = height;
    canvas!.style.width = `${width}px`;
    canvas!.style.height = `${height}px`;
    const context = canvas!.getContext("2d");
    if (context == null) throw new Error("Could not get context");
    if (context && newImg) {
      context.drawImage(newImg, 0, 0, width, height);
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "red";
      context.lineWidth = 2;
      contextRef.current = context;
    }
  }, [width, height, newImg]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { nativeEvent } = event;
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef == null) throw new Error("Could not get context");
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { nativeEvent } = event;
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();

      const setXY = {
        x: offsetX,
        y: offsetY,
      };
      setOffsetX([...offsetArray, setXY]);
    }
  };

  return (
    <div className="flex">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      ></canvas>
      <div className="result">
        {height && width && <div>{`${width} x  ${height} `}</div>}
        <div className="tab">
          {offsetArray
            .filter((_, index) => index % 10 === 0)
            .map((coordinate) => (
              <div className="card">{`${coordinate.x}:${coordinate.y}`}</div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DrawForm;
