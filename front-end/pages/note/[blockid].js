// import { resetServerContext } from "react-beautiful-dnd";
// import cookies from "next-cookies";
// import EditablePage from "../../components/editablePage/index";
//
// const Note = ({ blockid, blocks, err }) => {
//   return <EditablePage id={blockid} fetchedBlocks={blocks} err={err} />;
// };
//
// export const getServerSideProps = async (context) => {
//   resetServerContext(); // needed for drag and drop functionality
//   const blockId = context.query.blockid;
//   const req = context.req;
//   const { token } = cookies(context);
//   const res = context.res;
//
//
//   if (!token) {
//     res.writeHead(302, { Location: `/login` });
//     res.end();
//   }
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API}/blocks/${blockId}`,
//       {
//         method: "GET",
//         credentials: "include",
//         // Forward the authentication cookie to the backend
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: req ? req.headers.cookie : undefined,
//         },
//       }
//     );
//     const data = await response.json();
//     return {
//       props: { blocks: data.block.children, blockid: blockId, err: false },
//     };
//   } catch (err) {
//     console.log(err);
//     return { props: { blocks: null, blockid: null, err: true } };
//   }
// };
//
// export default Note;


import { resetServerContext } from "react-beautiful-dnd";
import cookies from "next-cookies";
import { connect } from 'react-redux';
import actions from '../../redux/actions/blockActions';
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'

import EditablePage from "../../components/editablePage/index";
function searchTree(element, matchingId){
     if(element._id == matchingId){
          return element;
     }else if (element.children != null){
          var i;
          var result = null;
          for(i=0; result == null && i < element.children.length; i++){
               result = searchTree(element.children[i], matchingId);
          }
          return result;
     }
     return null;
}

const Note = (props) => {
  const router = useRouter()
  const { blockid } = router.query;
  let searchedBlock = searchTree(props.blocks.blocks, blockid);

  if (searchedBlock == null) {
    searchedBlock = {children:[]};
  }
  const [blockId, setBlockId] = useState(blockid);
  const [block, setBlock] = useState(searchedBlock);
  const [isOpen, setIsOpen] = useState(false);

  const getNodeKey = ({ node }) => node._id;

  useEffect(() => {
      const { blockid } = router.query;
      let searchedBlock = searchTree(props.blocks.blocks, blockid);
      if (searchedBlock == null) {
        searchedBlock = {children:[]};
      }
      setBlock(searchedBlock);
      setBlockId(blockid);
  }, [searchedBlock])

  return <EditablePage key={blockId} id={blockId} fetchedBlocks={block.children} />;
};

export default connect(
  state => state
)(Note);
