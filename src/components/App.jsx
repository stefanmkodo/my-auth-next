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
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);
    const index = useRef(0);
    
    const maxFPS = useFPS();
    const clientId = useClientId();
    const tokens = useTokens();
    const status = useCheckStatus();
    
    useEffect(() => {
        if(!tokens || tokens.length < 1) return;
        if(!clientId) return;
        
        new Promise(resolve => {
            setTimeout(resolve, 2500);
        }).then(() => setIsLoading(false));
    }, [clientId, tokens]);
    
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
                        {status !== "passed" && (<canvas id="canvas" width="300" height="300" ref={canvasRef}></canvas>)}
                        {status !== "passed" && <p>Status: pending</p>}
                        {status === "passed" && (
                            <>
                                <img src={"/locked.gif"} alt={"passed"} className={"animate-in"}/>
                                <p>Status: passed</p>
                            </>
                        )}
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
