import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>SnackOverflow</p>
          <p className={styles.tagline}>Snack solutions for every office</p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
          <a href="#">Careers</a>
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} SnackOverflow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
