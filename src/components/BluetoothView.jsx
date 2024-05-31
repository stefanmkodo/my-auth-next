import React, {useEffect, useState} from "react";
import styles from "@/components/BluetoothView.module.css";

function BluetoothView() {
    const [error, setError] = useState(null);
    const [gattServer, setGattServer] = useState(null);
    const [gattService, setGattService] = useState(null);
    const [gattCharacteristic, setGattCharacteristic] = useState(null);
    const [characteristicValues, setCharacteristicValues] = useState([]);

    function onServerDisconnect(e) {
        setGattServer(e.target.gatt);
        setGattService(null);
        setGattCharacteristic(null);
    }

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
                gattCharacteristic.removeEventListener("characteristicvaluechanged", onCharacteristicChanged);
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
        if (gattServer) {
            if (gattServer.connected) {
                gattServer.getPrimaryService("0000aaa0-0000-1000-8000-aabbccddeeff").then((service) => {
                    setGattService(service);
                })
                gattServer.device.addEventListener("gattserverdisconnected", onServerDisconnect);
            } else {
                gattServer.device.removeEventListener("gattserverdisconnected", onServerDisconnect);
            }
        }
        return () => {
            if (gattServer) {
                gattServer.device.removeEventListener("gattserverdisconnected", onServerDisconnect);
            }
        }
    }, [gattServer]);

    async function onConnectClick() {
        try {
            if (navigator.bluetooth) {
                if (!gattServer) {
                    const device = await navigator.bluetooth.requestDevice({
                        acceptAllDevices: true,
                        optionalServices: ["0000aaa0-0000-1000-8000-aabbccddeeff"]
                    });
                    const server = await device.gatt.connect();
                    setGattServer(server);
                } else {
                    setGattServer(null);
                    const server = await gattServer.connect();
                    setGattServer(server);
                }
            } else {
                setError("Bluetooth not supported");
            }
        } catch (e) {
            setError(e.message);
        }
    }

    async function onDisconnectClick() {
        if (gattServer && gattServer.connected) {
            await gattServer.disconnect();
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
            {error && <p>{error}</p>}
            {gattServer && <div className={styles.btListContainer}>
                <ul className={styles.btList}>
                    <li className={styles.btListHeading}>GATT Server Information</li>
                    <li className={styles.btListItem}><span className={styles.btListItemValue}>Device:</span><span
                        className={styles.btListItemValue}>{gattServer.device.name}</span>
                    </li>
                    <li className={styles.btListItem}><span
                        className={styles.btListItemValue}>Status:</span>{gattServer.connected ?
                        <span className={`${styles.connected} ${styles.btListItemValue}`}>Connected</span> :
                        <span className={`${styles.notConnected} ${styles.btListItemValue}`}>Not Connected</span>}</li>
                </ul>
            </div>}
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
                <button className={styles.button} onClick={onConnectClick}>Connect to nearby
                    device</button>}
            {gattServer && gattServer.connected &&
                <button className={styles.button} onClick={onDisconnectClick}>Disconnect</button>}
            {gattServer && !gattServer.connected &&
                <button className={styles.button} onClick={onConnectClick}>Reconnect</button>}
        </>
    )
}

export default BluetoothView;