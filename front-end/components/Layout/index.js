
import Head from "next/head";
import Navbar from '../Navbar'
import Footer from '../Footer'
import ToolBar from '../toolBar'
import styles from "./styles.module.scss";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import authActions from '../../redux/actions/authActions'
import { fetchBlocks, updateBlock } from "../../redux/actions/blockActions";
import { fetchEvents, updateEvent } from "../../redux/actions/eventActions";
import { connect } from 'react-redux';

const Layout = (props) => {
  const blocks = props.blocks.blocks || [];
  const router = useRouter();

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);


  const isLoginPage = router.pathname === "/login";


  const toggleContextMenu = () => {
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };

  const handleNavigation = (path) => {
    closeContextMenu();
    router.push(path);
  };

  const navProps = {
    auth: props.auth,
    isLoginPage: isLoginPage,
    isContextMenuOpen: isContextMenuOpen,
    toggleContextMenu: toggleContextMenu,
    closeContextMenu: closeContextMenu,
    handleNavigation: handleNavigation
  }

  const toolProps = {
    blocks: blocks
  }
  
  return (
    <div id="layoutRoot">
      <Head>
        <title>Project Zeno</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <Navbar {...navProps} />
      <div className={styles.contentContainer}>
        {!isLoginPage && props.auth.token && (<ToolBar {...toolProps}/>) }
        <main className={styles.content}>{props.children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default connect(
  state => state
)(Layout);
