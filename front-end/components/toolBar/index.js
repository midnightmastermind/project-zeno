
import React, { Component } from 'react';
import SortableTree, { changeNodeAtPath }  from 'react-sortable-tree';
import * as FileExplorerTheme from "react-sortable-tree-theme-file-explorer";
import styles from './styles.module.css'
// In your own app, you would need to use import styles once in the app
//import 'react-sortable-tree/styles.css';

// This function handles arrays and objects
function eachRecursive(obj)
{
    for (var k in obj)
    {
      if (obj.blocks) {
        obj.children = obj.blocks
        return eachRecursive(obj.children)
      } else {
        return eachRecursive(obj[k])
      }
    }
    return obj
}

export default class ToolBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      treeData: props.blocks || [] ,
    };
  }
  render() {
    const TEAM_COLORS = ['Red', 'Black', 'Green', 'Blue'];
    const getNodeKey = ({ node }) => node._id;
    let treeData = this.state.treeData;
    let newTree = eachRecursive(treeData);
    console.log(newTree)
    return (
      <div className={`${styles.toolBar} ${this.state.isOpen ? styles.opened : ''}`}>
        <a className={styles.button} onClick={() => this.setState({isOpen: !this.state.isOpen})}><span className={`icon material-icons ${styles.icon}`}>menu</span></a>
        <div className={styles.navigation}>
         <div>
           <div style={{ height: 300 }}>
             <SortableTree
               treeData={treeData}
               onChange={treeData => this.setState({ treeData })}
               getNodeKey={getNodeKey}
               theme={FileExplorerTheme}
               generateNodeProps={({ node, path }) => {
                 return {
                   style: {
                   },
                   title: `${node.html}`,
                   onClick: () => {
                     this.setState(state => ({
                       treeData: changeNodeAtPath({
                         treeData: state.treeData,
                         path,
                         getNodeKey,
                         newNode: { ...node, expanded: !node.expanded },
                       }),
                     }));
                   },
                 };
               }}
             />
           </div>
         </div>
        </div>
      </div>
    );
  }
}
