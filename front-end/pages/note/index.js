import EditablePage from "../../components/editablePage";
import { connect } from 'react-redux';
import actions from '../../redux/actions/blockActions'
import { objectId, setCaretToEnd } from "../../utils";
// If a user hits "/", we create a blank page and redirect to that page
// so that each user gets his/her personal space to test things

const Note = ({ blockId, blocks, err }) => {
  return <EditablePage id={blockId} fetchedBlocks={blocks} err={err} />;
};


export const getServerSideProps = async (context) => {
  const res = context.res;
  const req = context.req;
  console.log(context);
  const block = { _id: objectId(), tag: "p", html: "", imageUrl: "", blocks: [], pageBlock: true};

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/blocks`, {
      method: "POST",
      credentials: "include",
      // Forward the authentication cookie to the backend
      headers: {
        "Content-Type": "application/json",
        Cookie: req ? req.headers.cookie : undefined,
      },
      body: JSON.stringify({
        block: block
      }),
    });
    const data = await response.json();
    const blockId = data.blockId;

    const creator = data.creator;
    const query = !creator ? "?public=true" : ""; // needed to show notice
    res.writeHead(302, { Location: `/note/${blockId}${query}` });
    res.end();
    return { props: {} };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, blockId: null, err: true } };
  }
};

export default connect(
  state => state,
  actions
)(Note);
