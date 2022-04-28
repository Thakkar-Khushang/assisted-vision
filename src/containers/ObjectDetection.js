// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./ObjectDetection.scss"
import { drawRect } from "../utilities/detection";
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import LoadingOverlay from "react-loading-overlay";

const ObjectDetection = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const { speak, speaking, cancel } = useSpeechSynthesis();
    const [loading, setLoading] = useState(true);

    // Main function
    const runCoco = async () => {
        const net = await cocossd.load();
        console.log("Handpose model loaded.");
        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 10);
    };

    const detect = async (net) => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            setLoading(false);
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const obj = await net.detect(video);

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawRect(obj, ctx, speak, speaking, cancel);
        }
    };

    useEffect(() => { runCoco() }, []);

    return (
        <div className="ObjectDetection">
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading your camera'
            />
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
            {/* </LoadingOverlay> */}
        </div>
    );
}

export default ObjectDetection;