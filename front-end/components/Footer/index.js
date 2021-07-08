import styles from './styles.module.scss'
import GithubIcon from "../../images/github.svg";

const Footer = () => {
    return (
      <div className={styles.footerBar}>
        <hr className={styles.hr} />
        <div className={styles.github}>
          <img src={GithubIcon} alt="Github Icon" />
        </div>
      </div>
    )
}

export default Footer;
