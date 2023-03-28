import React,{useState, useEffect} from "react";
import { DetectDocumentTextCommand, TextractClient } from "@aws-sdk/client-textract";
import { useSpeechSynthesis } from "react-speech-kit";

import { Buffer } from "buffer";

import './Ocr.scss';

const Ocr = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [src, setSrc] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { speak, speaking, cancel } = useSpeechSynthesis();

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
          return;
        }

        setImageUrl(URL.createObjectURL(e.target.files[0]));
    
        const reader = new FileReader();
        const file = e.target.files[0];
    
        reader.onload = function (upload) {
          setSrc(upload?.target?.result);
        };
        reader.readAsDataURL(file);
    };

    const onRunOCR = async () => {
        setLoading(true);
        const client = new TextractClient({
          region: 'us-east-1',
          credentials: {
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
          },
        });
    
        // convert image to byte Uint8Array base 64
        const blob = Buffer.from(src.split(',')[1], 'base64');
    
        const params = {
          Document: {
            Bytes: blob,
          },
          FeatureTypes: ['TABLES', 'FORMS'],
        };
    
        const command = new DetectDocumentTextCommand(params);
        try {
          const data = await client.send(command);
          // process data.
          if (data?.Blocks) {
            setData(data.Blocks);
        }
        setLoading(false);
        } catch (error) {
          console.log('err', error);
          setLoading(false);
          // error handling.
        } 
    };

    useEffect(() => {
        if (data?.length > 0) {
            speak({ text: "We are reading the text", queue: false });
            data?.map((item, index) => {
                if (item.Text) {
                    speak({ text: item.Text, queue: true });
                }
            });
        }
    }, [data]);

    return (
        <div className="ocr">
            <h1>OCR</h1>
            <div className="input-container">
                <input
                    className="inputfile"
                    id="file"
                    type="file"
                    name="file"
                    onChange={onSelectFile}
                />
                {imageUrl != null &&
                    <img src={imageUrl} className="uploaded-img" alt="selected" />
                }
            </div>
            {src !== "" &&
                <button onClick={onRunOCR} className="ocr-button">
                    Run OCR
                </button>
            }
            <div className="result">
                {loading && <span>Loading...</span>}
                {!loading && data?.length === 0 && <span>No data</span>}
                {!loading && data?.length > 0 && <span className="result-title">Result:</span>}
                {data?.map((item, index) => {
                    return (
                        <span key={index} style={{ margin: "2px", padding: "2px" }}>
                            {item.Text}
                        </span>
                    );
                    }
                )}
                </div>
        </div>
    );
}

export default Ocr;