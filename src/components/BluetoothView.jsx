import React, {useEffect, useState} from "react";
import styles from "@/components/BluetoothView.module.css";

function onServerDisconnect(e) {
    console.log(e);
}

function BluetoothView() {
    const [isPairing, setIsPairing] = useState(false);
    const [gattServer, setGattServer] = useState(null);
    const [gattService, setGattService] = useState(null);
    const [gattCharacteristic, setGattCharacteristic] = useState(null);
    const [characteristicValues, setCharacteristicValues] = useState([]);
    const [result, setResult] = useState("");

    function onCharacteristicChanged(e) {
        const now = new Date();
        setCharacteristicValues((prev) => [...prev, {
            timestamp: `${padDate(now.getDate())}-${padDate(now.getMonth() + 1)}-${padDate(now.getFullYear())}  ${padDate(now.getHours())}:${padDate(now.getMinutes())}:${padDate(now.getSeconds())}`,
            value: decodeCharacteristicValue(e.target.value.buffer)
        }]);
    }

    function padDate(date) {
        return date.toString().padStart(2, "0");
    }

    useEffect(() => {
        if (gattCharacteristic) {
            gattCharacteristic.startNotifications().then(() => {
                gattCharacteristic.addEventListener("characteristicvaluechanged", onCharacteristicChanged);
            })


            return () => {
                gattCharacteristic.stopNotifications().then(() => {
                    gattCharacteristic.removeEventListener("characteristicvaluechanged", onCharacteristicChanged);
                })
            }
        }
    }, [gattCharacteristic]);

    useEffect(() => {
        if (gattService) {
            gattService.getCharacteristic("0000aaa1-0000-1000-8000-aabbccddeeff").then((characteristic) => {
                setGattCharacteristic(characteristic);
            })
        }
    }, [gattService]);

    useEffect(() => {
        if (gattServer && gattServer.connected) {
            setResult(`Successfully connected to ${gattServer.device.name}`);
            gattServer.getPrimaryService("0000aaa0-0000-1000-8000-aabbccddeeff").then((service) => {
                setGattService(service);
            })
            console.log(gattServer.device);
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
                const device = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: ["0000aaa0-0000-1000-8000-aabbccddeeff"]
                });
                const server = await device.gatt.connect();
                setGattServer(server);
            } else {
                setResult("Bluetooth not supported");
            }
        } catch (e) {
            setResult(e.message);
        }
    }

    function onDisconnectClick() {
        if (gattServer && gattServer.connected) {
            gattServer.disconnect();
            setGattServer(null);
        }
    }

    function decodeCharacteristicValue(value) {
        if (value) {
            const decoder = new TextDecoder();
            return decoder.decode(value);
        }
        return null;
    }

    return (
        <>
            {result !== "" && <p>{result}</p>}
            {gattCharacteristic && <div>
                <p><span>Service UUID:</span><span>{gattCharacteristic.uuid}</span></p><br/>
                <div className={styles.btListContainer}>
                    <ul className={styles.btList}>
                        <li className={styles.btListHeading}>Value log</li>
                        {characteristicValues.length > 0 ? characteristicValues.map((value) => <li
                                key={value.timestamp} className={styles.btListItem}>
                            <span className={styles.btListItemTimestamp}>{value.timestamp}</span>
                            <span className={styles.btListItemValue}>{value.value}</span>
                            </li>) :
                            <li className={styles.btListItem}>No values received from mobile device</li>}
                    </ul>
                </div>
            </div>}
            {!gattServer &&
                <button disabled={isPairing} className={styles.button} onClick={onConnectClick}>Connect to nearby
                    device</button>}
            {gattServer &&
                <button className={styles.button} onClick={onDisconnectClick}>Disconnect</button>}
        </>
    )
}

export default BluetoothView;