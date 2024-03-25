import React, {useState} from "react";
import styles from "./AudioView.module.css";

const binary = "011000100110000101100101001100110011100101100011011000010110001000101101011000110011000100110101001101000010110100110100011000100011000000110110001011010110000101100101001101010011000100101101011001000011100001100100011001000110001101100101001101110110001100111000011000010011010100110101";
const uuid = "bae39cab-c154-4b06-ae51-d8ddce7c8a55";

const AudioView = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [freqLow, setFreqLow] = useState(200);
    const [freqHigh, setFreqHigh] = useState(250);
    const [toneDuration, setToneDuration] = useState(0.05);
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime);
    gain.connect(ctx.destination)

    const onPlayClick = () => {
        setIsPlaying(true);
        const currentTime = ctx.currentTime;
        const binaryArr = Array.from(binary);
        const endingTime = currentTime + (binaryArr.length * toneDuration);
        binaryArr.forEach((n, i) => {
            const val = parseInt(n);
            if (val === 1) {
                osc.frequency.setValueAtTime(freqLow, currentTime + (i * toneDuration));
            } else {
                osc.frequency.setValueAtTime(freqHigh, currentTime + (i * toneDuration));
            }
        });
        gain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.001, endingTime);
        setIsPlaying(false);
    }

    const onStopClick = () => {
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
    }

    return (
        <div className={styles.audioViewContainer}>
            <div>
                <div className={styles.binaryStringContainer}>
                    <span className={styles.binaryLabel}>UUID:</span>
                    <span className={styles.binaryString}>{uuid}</span>
                </div>
                <div className={styles.binaryStringContainer}>
                    <span className={styles.binaryLabel}>Binary String:</span>
                    <span className={styles.binaryString}>{binary}</span>
                </div>
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor={"tone-input"}>Tone Duration (s)</label>
                <input id={"tone-input"} placeholder={"Tone Duration"} type={"number"} value={toneDuration}
                       onChange={(e) => setToneDuration(e.target.value)}/>
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor={"low-freq-input"}>Low Frequency</label>
                <input id={"low-freq-input"} placeholder={"Low Frequency"} type={"number"} value={freqLow}
                       onChange={(e) => setFreqLow(e.target.value)}/>
            </div>
            <div className={styles.inputContainer}>
                <label htmlFor={"high-freq-input"}>High Frequency</label>
                <input id={"high-freq-input"} placeholder={"High Frequency"} type={"number"} value={freqHigh}
                       onChange={(e) => setFreqHigh(e.target.value)}/>
            </div>
            <button disabled={isPlaying} className={styles.button} onClick={onPlayClick}>Play sound</button>
        </div>
    )
}

export default AudioView;