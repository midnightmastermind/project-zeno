//
// import React, { Component } from 'react';
// import SortableTree, { changeNodeAtPath }  from 'react-sortable-tree';
// import * as FileExplorerTheme from "react-sortable-tree-theme-file-explorer";
// import styles from './styles.module.css'
// // In your own app, you would need to use import styles once in the app
// //import 'react-sortable-tree/styles.css';
//
// // This function handles arrays and objects
// export default class ToolBar extends Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       isOpen: false,
//       treeData: [props.blocks] || [] ,
//     };
//   }
//   render() {
//     const TEAM_COLORS = ['Red', 'Black', 'Green', 'Blue'];
//     const getNodeKey = ({ node }) => node._id;
//     let treeData = this.state.treeData;
//     console.log(treeData)
//     return (
//       <div className={`${styles.toolBar} ${this.state.isOpen ? styles.opened : ''}`}>
//         <a className={styles.button} onClick={() => this.setState({isOpen: !this.state.isOpen})}><span className={`icon material-icons ${styles.icon}`}>menu</span></a>
//         <div className={styles.navigation}>
//          <div>
//            <div style={{ height: 300 }}>
//              <SortableTree
//                treeData={treeData}
//                onChange={treeData => this.setState({ treeData })}
//                getNodeKey={getNodeKey}
//                theme={FileExplorerTheme}
//                generateNodeProps={({ node, path }) => {
//                  return {
//                    style: {
//                    },
//                    title: `${node.html}`,
//                    onClick: () => {
//                      this.setState(state => ({
//                        treeData: changeNodeAtPath({
//                          treeData: state.treeData,
//                          path,
//                          getNodeKey,
//                          newNode: { ...node, expanded: !node.expanded },
//                        }),
//                      }));
//                    },
//                  };
//                }}
//              />
//            </div>
//          </div>
//         </div>
//       </div>
//     );
//   }
// }


import React from 'react';
import SortableTree, { changeNodeAtPath }  from 'react-sortable-tree';
import styles from './styles.module.scss'
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";
import { connect } from 'react-redux';
import { objectId, setCaretToEnd } from "../../utils";
import actions from '../../redux/actions/blockActions';
const merge = require('lodash.merge');

const ToolBar = (props) => {
  const router = useRouter();

  const [treeData, setTreeData] = useState([props.blocks.toolBar]);
  const [isOpen, setIsOpen] = useState(false);
  const [fileTheme, setFileTheme] = useState(null);

  useEffect(() => {
      setTreeData([props.blocks.toolBar]);
  }, [props.blocks.toolBar])

  useEffect(() => {
    (function importSortableTree() {
      import('react-sortable-tree-theme-file-explorer').then((obj) => {
        setFileTheme(obj.default);
      })
    })();
  }, [])
  const handleSetTreeData = (newTreeData) => {
    const newTree = merge([props.blocks.blocks], newTreeData);
    props.updateBlock(newTree[0]);
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
  const getNodeKey = ({ node }) => node._id;

  return (
    <>
      <div className={`${styles.toolBar} ${isOpen ? styles.opened : ''}`}>
        <a className={styles.button} onClick={() => setIsOpen(!isOpen)}><span className={`icon material-icons ${styles.icon}`}>menu</span></a>
        <div className={styles.navigationContainer}>
         <div className={styles.navigation}>
           <div style={{ height: '31rem' }}>
             <SortableTree
               treeData={treeData}
               onChange={treeData => handleSetTreeData( treeData )}
               getNodeKey={getNodeKey}
               dndType="blocks"
               theme={fileTheme}
               generateNodeProps={({ node, path }) => {
                   return {
                     className: `${node.type}`,
                     style: {
                     },
                     title: `${node.html}`,
                     onDrag: () => {
                       console.log("drag me")
                     },
                     onClick: (e) => {
                    	const clickedItemClassName = e.target.className;
                    	if (
                    		clickedItemClassName !== 'rstcustom__expandButton' &&
                    		clickedItemClassName !== 'rstcustom__collapseButton'
                    	) {
                    		router.push("/note/[blockid]", `/note/${node._id}`);
                    	} else {
                        handleSetTreeData(changeNodeAtPath({
                            treeData: treeData,
                            path,
                            getNodeKey,
                            newNode: { ...node, expanded: !node.expanded },
                        }));
                      }
                     },
                   };
               }}
             />
           </div>
           <span className={styles.addbutton} onClick={(e) => handleCreatePage(e)}>Create A New Page</span>
         </div>
        </div>
      </div>
    </>
  );
};

export default connect(
  state => state,
  actions
)(ToolBar);
