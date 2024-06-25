import React, {useEffect, useState} from "react";
import styles from "@/components/BluetoothView.module.css";
import GattServicesView, {getCharacteristicName} from "@/components/GattServicesView";

const SERVICES_TO_SEARCH_FOR = [0xAB7F];

function BluetoothView() {
    const [error, setError] = useState(null);
    const [gattServer, setGattServer] = useState(null);
    const [availableServices, setAvailableServices] = useState([]);
    const [valueLog, setValueLog] = useState([]);

    function onServerDisconnect(e) {
        setGattServer(e.target.gatt);
        setValueLog([]);
        setAvailableServices([]);
    }

    useEffect(() => {
        if (gattServer) {
            setError(null);
            if (gattServer.connected) {
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

    async function getServicesInServer(server) {
        if (server) {
            if (server.connected) {
                const primaryServices = await server.getPrimaryServices();
                console.log("Primary services:", primaryServices);
                const servicesList = await Promise.all(primaryServices.map(async (service) => {
                    let result = {};
                    result["uuid"] = service.uuid;
                    const characteristics = await service.getCharacteristics();
                    console.log("Characteristics:", characteristics);
                    result["characteristics"] = characteristics.map((c) => ({ uuid: c.uuid, properties: c.properties }));

                    return result;
                }))
                setAvailableServices(servicesList);
            }
        }
    }

    async function onConnectClick() {
        try {
            if (navigator.bluetooth) {
                const isBluetoothAvailable = await navigator.bluetooth.getAvailability();
                if (isBluetoothAvailable) {
                    if (!gattServer) {
                        const device = await navigator.bluetooth.requestDevice({
                            filters: [{services: SERVICES_TO_SEARCH_FOR}]
                        });
                        const server = await device.gatt.connect();
                        setGattServer(server);
                        await getServicesInServer(server);
                    } else {
                        setGattServer(null);
                        const server = await gattServer.connect();
                        setGattServer(server);
                        await getServicesInServer(server);
                    }
                } else {
                    setError("Bluetooth not supported on this device")
                }
            } else {
                setError("Bluetooth not supported in this browser");
            }
        } catch (e) {
            console.error("Thrown in try/catch of onConnectClick", e.message);
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
            const decoder = new TextDecoder("utf-8");
            return decoder.decode(value);
        }
        return null;
    }

    const onCharacteristicValueChange = (e) => {
        const receivedTimestamp = formatDate(new Date());
        setValueLog([...valueLog, { cName: getCharacteristicName(e.target.uuid), cValue: decodeCharacteristicValue(e.target.value), cTimestamp: receivedTimestamp, method: "NOTIFY" }]);
    }

    function formatDate(date) {
        return date.toLocaleString("en-GB", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            fractionalSecondDigits: 3,
            hour12: false,
        });
    }

    async function onCharacteristicRead(serviceUuid, characteristicUuid) {
        const receivedTimestamp = formatDate(new Date());
        const service = await gattServer.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(characteristicUuid);
        const value = await characteristic.readValue();
        setValueLog([...valueLog, { cName: getCharacteristicName(characteristicUuid), cValue: decodeCharacteristicValue(value), cTimestamp: receivedTimestamp, method: "READ" }]);
    }

    async function onStartNotifications(serviceUuid, characteristicUuid) {
        const service = await gattServer.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(characteristicUuid);
        await characteristic.startNotifications();
        console.log("notifications started for:", getCharacteristicName(characteristicUuid));
        characteristic.oncharacteristicvaluechanged = onCharacteristicValueChange;
    }

    async function onWrite(serviceUuid, characteristicUuid, value) {
        const service = await gattServer.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(characteristicUuid);
        const valueToWrite = new TextEncoder().encode(value);
        const receivedTimestamp = formatDate(new Date());
        await characteristic.writeValueWithResponse(valueToWrite);
        const readValue = await characteristic.readValue();
        setValueLog([...valueLog, { cName: getCharacteristicName(characteristicUuid), cValue: decodeCharacteristicValue(readValue), cTimestamp: receivedTimestamp, method: "WRITE" }]);
    }

    return (
        <>
            {error && <p>{error}</p>}
            {gattServer && <div className={styles.btListContainer}>
                <ul className={styles.btList}>
                    <li className={styles.btListHeading}>GATT Server Information</li>
                    <li className={styles.btListItem}><span className={styles.btListItemValue}>Device Name:</span><span
                        className={styles.btListItemValue}>{gattServer.device.name}</span>
                    </li>
                    <li className={styles.btListItem}><span className={styles.btListItemValue}>Device ID:</span><span
                        className={styles.btListItemValue}>{gattServer.device.id}</span>
                    </li>
                    <li className={styles.btListItem}><span
                        className={styles.btListItemValue}>Status:</span>{gattServer.connected ?
                        <span className={`${styles.connected} ${styles.btListItemValue}`}>Connected</span> :
                        <span className={`${styles.notConnected} ${styles.btListItemValue}`}>Not Connected</span>}</li>
                </ul>
            </div>}
            {availableServices.length > 0 &&
                <GattServicesView services={availableServices} onRead={onCharacteristicRead} onNotificationsStart={onStartNotifications} onWrite={onWrite}/>}
            {valueLog.length > 0 && (
                <div className={styles.btListContainer}>
                    <ul className={styles.btList}>
                        <li className={styles.btListHeading}>GATT Characteristic Information</li>
                        {valueLog.map(({ cName, cValue, cTimestamp, method }) => {
                            return <li key={`${cName}-${cTimestamp}`} className={styles.btListItem}>
                                <span className={styles.btListItemValue}>{cName}:</span>
                                <span className={styles.btListItemValue}>{cValue}</span>
                                <span className={styles.btListItemValue}>{method}</span>
                                <span className={styles.btListItemValue}>{cTimestamp}</span>
                            </li>
                        })}
                    </ul>
                </div>
            )}
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