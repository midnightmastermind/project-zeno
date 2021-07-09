import { useState, useEffect } from "react";
import { connect } from 'react-redux';
import Card from "../../components/card";
import Button from "../../components/button";
import Notice from "../../components/notice";
import actions from "../../redux/actions/blockActions"
import {useSelector} from 'react-redux'
const NotesPage = (props) => {
  const cards = props.blocks.blocks || []

  const deleteCard = async (blockId) => {
      await props.deleteBlock(blockId)
  };

  return (
    <>
      <div className="boxContainer fullWidth">
        <div className="topHeader"><h2>Notes</h2></div>
        <div className="blockList scrollable" id="blockList">
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
            const blocks = block.blocks;
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
        <Button href="/note">Create A New Page</Button>
      </div>
    </>
  );
};

export default connect(
  state => state,
  actions
)(NotesPage);
