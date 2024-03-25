import React from "react";
import styles from "./TabSelector.module.css";

const TabSelector = ({ currentTab, onSelect, items }) => {
    return (
        <ul className={styles.tabSelector}>
            {items.map((item) => {
                return <li className={`${styles.tabSelectorItem} ${currentTab === item ? styles.active : ""}`} key={item} onClick={() => onSelect(item)}>{item}</li>
            })}
        </ul>
    )
}

export default TabSelector;