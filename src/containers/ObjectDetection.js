// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import "./ObjectDetection.scss";
import { drawRect } from "../utilities/detection";
import { useNavigate } from "react-router-dom";

const ObjectDetection = () => {
  let navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { speak, speaking, cancel } = useSpeechSynthesis();
  const [loading, setLoading] = useState(true);

  const [value, setValue] = useState("");
  const [object, setObject] = useState("");

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);

      switch (result) {
        case "stop":
        case "Stop":
        case "stop.":
        case "Stop.":
          navigate(`/quiz/${object}`);
          break;
        default:
          break;
      }

      setValue(result);
    },
  });

  const initListening = async () => {
    listen({ interimResults: true });
  };

  // Main function
  const runCoco = async () => {
    console.log("loading model...");
    const net = await cocossd.load();
    console.log("Model loaded.");
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      setLoading(false);
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);

      const ctx = canvasRef.current.getContext("2d");
      setObject(drawRect(obj, ctx, speak, speaking, cancel));
    }
  };

  useEffect(() => {
    runCoco();
    initListening();
  }, []);

  return (
    <div className="ObjectDetection">
      <div className="webcam-div">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </div>
      <button
        onClick={() => {
          initListening();
        }}
        className="Landing-button"
      >
        Give Command
      </button>
      {loading && <h3>Loading</h3>}
    </div>
  );
};

export default ObjectDetection;
