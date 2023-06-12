import {useEffect, useRef, useState} from 'react'
import {startAnimating, stopAnimation} from "@/utils/animate";
import QRCode from 'qrcode';
import useFPS from "../hooks/useFPS.js";
import getParam from "../utils/queryString.js";
import useClientId from "../hooks/useClientId.js";
import useTokens from "../hooks/useTokens.js";
import useCheckStatus from "../hooks/useCheckStatus.js";
import {Footer, Loader} from "./Footer.jsx";
import {Header} from "./Header.jsx";

function App() {
    const [fps, setFps] = useState(60);
    const [numOfCharacters, setNumOfCharacters] = useState(6);
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);
    const index = useRef(0);
    
    const maxFPS = useFPS();
    const clientId = useClientId();
    const tokens = useTokens(numOfCharacters);
    const status = useCheckStatus();
    
    // loading screen once we have tokens and client id
    useEffect(() => {
        if(!tokens || tokens.length < 1) return;
        if(!clientId) return;
        
        new Promise(resolve => {
            setTimeout(resolve, 2500);
        }).then(() => setIsLoading(false));
    }, [clientId, tokens]);
    
    
    // sets fps from query string
    useEffect(() => {
        index.current = 0;
        if(getParam('fps')) setFps(getParam('fps'));
    }, [tokens]);
    
    
    useEffect(() => {
        if (!tokens || tokens.length < 1 || status) return;
        
        function drawQRCode() {
            let value = `MKD${tokens[index.current]}`;
            QRCode.toCanvas(canvasRef.current, value, {
                version: 1,
                width: 300
            }, function (error) {
                if (error) {
                    console.error(error);
                } else {
                    index.current = (index.current + 1) % tokens.length;
                }
            });
        }
        
        startAnimating(fps, drawQRCode);
        
        return () => stopAnimation();
    }, [tokens, status, fps]);
    
    return (
        <div id={"root"}>
            <Header/>
            <div className="App">
                {isLoading && (<Loader />)}
                {!isLoading && (
                    <>
                        <p>Client ID: {clientId}</p>
                        <p id="results">Results at {fps}fps | max {maxFPS}</p>
                        <p>Number of Characters: {numOfCharacters}</p>
                        {status !== "passed" && (<canvas id="canvas" width="300" height="300" ref={canvasRef}></canvas>)}
                        {status !== "passed" && <p>Status: pending</p>}
                        {status === "passed" && (
                            <>
                                <img src={"/Unlock.gif"} alt={"passed"} className={"animate-in"}/>
                                <p>Status: passed</p>
                            </>
                        )}
                        <form id="configs">
                            <div className="fpsInput">
                                <label htmlFor="fps">FPS </label>
                                <input type="number" id="fps" name="fps" min={0} defaultValue={fps} onChange={e => setFps(e.currentTarget.value)}/>
                            </div>
                            <div className="characterInput">
                                <label htmlFor="numOfCharacters">Number of Characters </label>
                                <input type="number" id="numOfCharacters" name="numOfCharacters" min="0" step="2" defaultValue={numOfCharacters} onChange={e => setNumOfCharacters(e.currentTarget.value)}/>
                            </div>
                        </form>
                        <div id="message">{JSON.stringify(tokens)}</div>
                    </>
                )}
            </div>
            <Footer status={status}/>
        </div>
    )
}

export default App;


function drawSomething() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${Math.round(Math.random() * 200)}, ${Math.round(Math.random() * 200)}, ${Math.round(Math.random() * 200)})`;
    ctx.fillRect(10, 10, 50, 50);
}
