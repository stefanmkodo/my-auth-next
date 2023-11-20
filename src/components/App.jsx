import {useEffect, useRef, useState} from 'react'
import {startAnimating, stopAnimation} from "@/utils/animate";
import QRCode from 'qrcode';
import useFPS from "../hooks/useFPS.js";
import getParam from "../utils/queryString.js";
import usePassKey from "../hooks/usePassKey.js";
import useTokens from "../hooks/useTokens.js";
import useCheckStatus from "../hooks/useCheckStatus.js";
import {Footer, Loader} from "./Footer.jsx";
import {Header} from "./Header.jsx";
import Image from "next/image";

function App() {
    const [fps, setFps] = useState(60);
    const [numOfCharacters, setNumOfCharacters] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);
    const index = useRef(0);
    const [displayMessage, setDisplayMessage] = useState(false);
    const [isCycling, setIsCycling] = useState(false);
    const [noOfCycles, setNoOfCycles] = useState(2);
    const [targetId, setTargetId] = useState(0);

    const maxFPS = useFPS();
    const { clientId, passKey, hashedIP } = usePassKey();
    const combinedInfo = combine(clientId, passKey, hashedIP);
    const tokens = useTokens(combinedInfo, numOfCharacters);
    const status = useCheckStatus();

    useEffect(() => {
        if (!isCycling) {
            setTargetId(Math.floor(Math.random() * 4));
        }
    }, [isCycling])
    
    // loading screen once we have tokens and client id
    useEffect(() => {
        if (!tokens || tokens.length < 1) return;
        if (!clientId) return;
        
        new Promise(resolve => {
            setTimeout(resolve, 2500);
        }).then(() => setIsLoading(false));
    }, [clientId, tokens]);
    
    
    // sets fps from query string
    useEffect(() => {
        index.current = 0;
        if (getParam('fps')) setFps(getParam('fps'));
    }, [tokens]);
    
    
    useEffect(() => {
        if (!tokens || tokens.length < 1 || status) return;
        let currentCycle = 1;
        
        function drawQRCode() {
            let value = tokens[index.current];
            QRCode.toCanvas(canvasRef.current, value, {
                version: 1,
                width: 300
            }, function (error) {
                const isFinalSection = index.current === tokens.length - 1;
                const resetIndex = () => index.current = 0;
                const continueLooping = () => {
                    index.current = (index.current + 1) % tokens.length;
                }

                if (error) {
                    console.error(error);
                } else {
                    if (currentCycle === noOfCycles && isFinalSection) {
                        stopAnimation();
                        resetIndex();
                        setIsCycling(false);
                    } else {
                        if (currentCycle < noOfCycles && isFinalSection) {
                            currentCycle++;
                        }
                        continueLooping();
                    }
                }
            });
        }

        if (isCycling) {
            startAnimating(fps ,drawQRCode);
        }

        return () => stopAnimation();
    }, [tokens, status, fps, isCycling]);
    
    return (
        <div id={"root"}>
            <Header/>
            <div className="App">
                {isLoading && (<Loader/>)}
                {!isLoading && (
                    <>
                        <p>Client ID: {clientId}</p>
                        <p id="results">Results at {fps}fps | max {maxFPS}</p>
                        <p>Number of Characters: {numOfCharacters}</p>
                        <div className={"qrCodeContainer"}>
                            <div className={`frameTarget-${targetId} corners-border`} />
                            {status !== "passed" && isCycling && (
                                <canvas id="canvas" width="300" height="300" ref={canvasRef}></canvas>)}
                        </div>
                        {status !== "passed" && <p>Status: pending</p>}
                        {status === "passed" && (
                            <>
                                <Image src={"/Unlock.gif"} alt={"passed"} className={"animate-in"}/>
                                <p>Status: passed</p>
                            </>
                        )}
                        {!isCycling && (
                            <>
                                <label htmlFor={"number-of-cycles-input"}>Number of cycles:</label>
                                <input id={"number-of-cycles-input"} type={"number"} value={noOfCycles} onChange={(e) => setNoOfCycles(+e.target.value)} />
                                <button onClick={() => setIsCycling(true)}>Start</button>
                            </>
                        )}
                        <h2>Config</h2>
                        <form id="configs">
                            <div className="fpsInput mb-2">
                                <label htmlFor="fps">FPS </label>
                                <input type="number" id="fps" name="fps" min={0} defaultValue={fps}
                                       onChange={e => setFps(e.currentTarget.value)}/>
                            </div>
                            <div className="characterInput mb-2">
                                <label htmlFor="numOfCharacters">Number of Characters </label>
                                <input type="number" id="numOfCharacters" name="numOfCharacters" min="0" step="2"
                                       defaultValue={numOfCharacters}
                                       onChange={e => setNumOfCharacters(e.currentTarget.value)}/>
                            </div>
                        </form>
                        <div className="messageDropdown">
                            <div className="messageHeader" onClick={() => setDisplayMessage((prevDisplay) => !prevDisplay)}>Full Message {displayMessage ? "▲" : "▼"}</div>
                            <div id="message" style={{ display: displayMessage ? "block" : "none" }}>{JSON.stringify(tokens)}</div>
                        </div>
                    </>
                )}
            </div>
            <Footer status={status}/>
        </div>
    )
}

export default App;

function combine(clientId, passKey, hashedIp) {
    if (clientId && passKey && hashedIp) {
        const clientIdInTwo = splitStringInHalf(clientId);
        const passKeyInTwo = splitStringInHalf(passKey);
        const hashedIpInTwo = splitStringInHalf(hashedIp.toLowerCase());

        const sections = clientIdInTwo.concat(passKeyInTwo.concat(hashedIpInTwo))

        return sections[0] + sections[2] + sections[4] + sections[1] + sections[3] + sections[5];
    }
    return null;
}

function splitStringInHalf(inputString) {
    const middleIndex = Math.floor(inputString.length / 2);
    const firstSection = inputString.slice(0, middleIndex);
    const secondSection = inputString.slice(middleIndex);
    return [firstSection, secondSection];
}

function drawSomething() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${Math.round(Math.random() * 200)}, ${Math.round(Math.random() * 200)}, ${Math.round(Math.random() * 200)})`;
    ctx.fillRect(10, 10, 50, 50);
}
