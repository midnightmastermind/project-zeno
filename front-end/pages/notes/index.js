import { useState } from "react";
import { connect } from 'react-redux';
import Card from "../../components/card";
import Button from "../../components/button";
import Notice from "../../components/notice";
import actions from "../../redux/actions/blockActions"
const NotesPage = (props) => {
  const initialPages = props.blocks.blocks || [];
  const [cards, setCards] = useState(initialPages);

  const deleteCard = async (blockId) => {
      console.log("hit");
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

// export const getServerSideProps = async (props) => {
//   console.log(props);
//
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API}/blocks`, {
//       method: "GET",
//       credentials: "include",
//       // Forward the authentication cookie to the backend
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: req ? req.headers.cookie : undefined,
//       },
//     });
//     const data = await response.json();
//     const blockIdList = data.blocks;
//     const blocks = await Promise.all(
//       blockIdList.map(async (id) => {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API}/blocks/${id}`,
//           {
//             method: "GET",
//             credentials: "include",
//             // Forward the authentication cookie to the backend
//             headers: {
//               "Content-Type": "application/json",
//               Cookie: req ? req.headers.cookie : undefined,
//             },
//           }
//         );
//         return await response.json();
//       })
//     );
//     const filteredPages = blocks.filter((block) => !block.errCode);
//     return { props: { blocks: filteredPages } };
//   } catch (err) {
//     console.log(err);
//     return { props: {} };
//   }
// };

export default connect(
  state => state,
  actions
)(NotesPage);
