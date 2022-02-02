import { useState, useEffect } from "react";
import { connect } from 'react-redux';
import Card from "../../components/card";
import Button from "../../components/button";
import Notice from "../../components/notice";
import actions from "../../redux/actions/blockActions";
import {useSelector} from 'react-redux';
import styles from "./styles.module.scss";
import { objectId, setCaretToEnd } from "../../utils";

const NotesPage = (props) => {
  let rootBlock = null

  if (props.blocks && props.blocks.blocks) {
    rootBlock = props.blocks.blocks
  }

  const cards = rootBlock ? rootBlock.children : []

  const deleteCard = async (blockId) => {
      await props.deleteBlock(blockId)
  };

  const handleCreatePage = async (e) => {
    const block = { _id: objectId(), tag: "p", html: "Untitled", imageUrl: "", children: [], type: 'PageBlock'};
    try {
      props.createBlock(block);
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  return (
    <>
      <div className="boxContainer fullWidth">
        <div className="topHeader"><h2>Notes</h2></div>
        <div className={`${styles.blockList} scrollable`} id="blockList">
          {cards.length === 0 && (
            <Notice style={{ marginBottom: "2rem" }}>
              <h3>Let's go!</h3>
              <p>Seems like you haven't created any blocks so far.</p>
              <p>How about starting now?</p>
            </Notice>
          )}
          {cards.map((block, key) => {
            const updatedAtDate = new Date(Date.parse(block.updatedAt));
            const blockId = block._id;
            const blocks = block.children;
            return (
              <Card
                key={key}
                blockId={blockId}
                date={updatedAtDate}
                content={blocks}
                deleteCard={(blockId) => deleteCard(blockId)}
              />
            );
          })}
        </div>
        <span className={styles.button} onClick={(e) => handleCreatePage(e)}>Create A New Page</span>
      </div>
    </>
  );
};

export default connect(
  state => state,
  actions
)(NotesPage);
