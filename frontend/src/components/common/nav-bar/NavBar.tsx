import React from 'react'
import styles from './NavBar.module.scss'

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <div>
        <span className={styles.title}>POSTMAN</span>
        <span className={[styles.active, styles.link].join(' ')}>Campaigns</span>
        <span className={styles.link}>Create</span>
        <span className={styles.link}>Guide</span>
        <span className={[styles.link, styles.stretch].join(' ')}>Settings</span>

        <span className={styles.userLinks}>postman@open.gov.sg</span>
        <span className={styles.userLinks}>logout</span>

      </div>
    </div>
  )
}

export default NavBar