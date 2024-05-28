import React, {useEffect, useState} from "react";
import styles from "@/components/AudioView.module.css";

function onServerDisconnect(e) {
    console.log(e);
}

function BluetoothView() {
    const [isPairing, setIsPairing] = useState(false);
    const [gattServer, setGattServer] = useState(null);
    const [result, setResult] = useState("");

    useEffect(() => {
        if (gattServer && gattServer.connected) {
            setResult(`Successfully connected to ${gattServer.device.name}`);
            gattServer.device.addEventListener("ongattserverdisconnected", onServerDisconnect);
        }
        return () => {
            if (gattServer) {
                gattServer.device.removeEventListener("ongattserverdisconnected", onServerDisconnect);
            }
        }
    }, [gattServer]);

    async function onConnectClick() {
        try {
            if (navigator.bluetooth) {
                const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
                const server = await device.gatt.connect();
                setGattServer(server);
            } else {
                setResult("Bluetooth not supported");
            }
        } catch (e) {
            setResult(e.message);
        }
    }

    async function onDisconnectClick() {
        if (gattServer && gattServer.connected) {
            gattServer.disconnect().then(() => setGattServer(null));
        }
    }

    return (
        <>
            {result !== "" && <p>{result}</p>}
            {!gattServer && <button disabled={isPairing} className={styles.button} onClick={onConnectClick}>Connect to nearby device</button>}
            {gattServer &&
                <button className={styles.button} onClick={onDisconnectClick}>Disconnect</button>}
        </>
    )
}

export default BluetoothView;