import styles from "./styles.module.scss";

const Button = ({ children, onClickHandler, href, className }) => {
  return (
    <a
      href={href}
      role="button"
      tabIndex="0"
      className={`${styles.button} + ${className}`}
      onClick={onClickHandler}
      onKeyDown={onClickHandler}
    >
      {children}
    </a>
  );
};

export default Button;
