import { resetServerContext } from "react-beautiful-dnd";
import cookies from "next-cookies";
import EditablePage from "../../components/editablePage/index";

const Note = ({ blockid, blocks, err }) => {
  return <EditablePage id={blockid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => {
  resetServerContext(); // needed for drag and drop functionality
  const blockId = context.query.blockid;
  const req = context.req;
  const { token } = cookies(context);
  const res = context.res;


  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/blocks/${blockId}`,
      {
        method: "GET",
        credentials: "include",
        // Forward the authentication cookie to the backend
        headers: {
          "Content-Type": "application/json",
          Cookie: req ? req.headers.cookie : undefined,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return {
      props: { blocks: data.block.blocks, blockid: blockId, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, blockid: null, err: true } };
  }
};

export default Note;
