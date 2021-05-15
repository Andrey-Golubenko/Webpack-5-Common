import React from 'react'
import styles from './hello.module.scss'

export default function ({name = 'user'}) {
    return <div className={styles.box}>
               <h2 className={styles.alert}>Hello {name}</h2>
               <p>Welcome to site!</p>
           </div>
}