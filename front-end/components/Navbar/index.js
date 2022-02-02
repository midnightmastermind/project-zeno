import Link from 'next/link'
import Button from "../button";
import styles from './styles.module.scss'
import UserIcon from "../../images/user.svg";
import ContextMenu from "../contextMenu";

const Navbar = (props) => {
  return (
      <header className={styles.headerBar}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              stoa<span style={{ fontSize: "1.25rem" }}>.page</span>
            </a>
          </Link>
          <div className={styles.logoImage}></div>
        </div>
        <div className={styles.nav}>
          <div className={styles.site_nav}>
            <Link href="/"><a><span className={`icon material-icons ${styles.icon}`}>home</span>home</a></Link>
            <Link href="/notes"><a><span className={`icon material-icons ${styles.icon}`}>book</span>notes</a></Link>
            <Link href="/calendar"><a><span className={`icon material-icons ${styles.icon}`}>date_range</span>calendar</a></Link>
          </div>
          {!props.isLoginPage && !(props.auth.token) && <Button className={styles.login} href="/login">Login</Button>}
          {!props.isLoginPage && props.auth.token && (
            <div className={styles.user}>
              <span
                role="button"
                tabIndex="0"
                onClick={() => props.toggleContextMenu()}
              >
                <img src={UserIcon} alt="User Icon" />
              </span>
            </div>
          )}
          </div>
        {!props.isLoginPage && props.auth.token && props.isContextMenuOpen && (
          <ContextMenu
            menuItems={[
              {
                id: "account",
                label: "Account",
                action: () => props.handleNavigation("/account"),
              },
              {
                id: "logout",
                label: "Logout",
                action: () => props.handleNavigation("/logout"),
              },
            ]}
            closeAction={() => props.closeContextMenu()}
            isTopNavigation={true}
          />
        )}
      </header>
  )
}

export default Navbar
