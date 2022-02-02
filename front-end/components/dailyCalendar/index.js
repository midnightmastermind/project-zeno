import React, {Component} from 'react';
import styled from 'styled-components';
import { getHours, startOfDay, startOfHour, endOfDay, addDays, subDays, getUnixTime, setDate, eachHourOfInterval, eachWeekOfInterval, eachDayOfInterval, getDay, getDate, format, startOfWeek, startOfMonth, addMonths, endOfWeek, endOfMonth, isSameMonth, isSameDay, toDate, subMonths, getDaysInMonth} from "date-fns";
import { chunk } from 'lodash';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import SortableTree from "react-sortable-tree";
import styles from "./styles.module.scss";
const days_of_the_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


const Frame = styled.div`
    color: white;
`;

const Header = styled.div`
     text-transform: uppercase;
     border-bottom: 1px solid #787a80;
`;

const Button = styled.div`
    cursor: pointer;
    height: 15px;
`;

const Body = styled.div`
    width: 100%;
    display: flex;
`;


const Day = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    height: 100%;
`;

class DailyCalendar extends Component {
    constructor(props) {
        super(props);
        this.completeTask = this.completeTask.bind(this);
        this.sortableElement = this.sortableElement.bind(this);
        this.setView = this.setView.bind(this);
        this.moveNode = this.moveNode.bind(this);
        this.state = {
            currentDay: startOfDay(new Date()),
            today: [],
            yesterday: [],
            tomorrow: [],
            events: props.events || [],
            view: ["basic", "basic", "basic"]
        }
    }
    nextDay = () => {
      this.setState({
        currentDay: addDays(this.state.currentDay, 1)
      });
    };

    prevDay = () => {
      this.setState({
        currentDay: subDays(this.state.currentDay, 1)
      });
    };
    setView(i, view) {

        let views = this.state.view;
        views[i] = view;
        this.setState({
            view: views
        })
    }
    static getDerivedStateFromProps(props, state) {
        if(props.events && props.events !== state.events)
        {
          return {
            events: props.events
          };
        }
        return null;
      }
      completeTask(node) {
          console.log(node);
      }
      sortableElement(parent_el, tree, hours, i) {
          let sortableElement;
          if (this.state.view[i] === "basic") {
              let newTree = []
              if (tree) {
                  newTree = Object.values(tree);
                  newTree = newTree.flat(1);
              }

              sortableElement = (<div className={styles.hour} style={{height: '100%', display: 'flex', width: '100%'}}>
                  <SortableTree
                    treeData={newTree}
                    onChange={treeData => {
                        // if (i === 0) {
                        //     this.setState({ yesterday: treeData})
                        // } else if (i === 1) {
                        //     this.setState({ today: treeData})
                        // } else {
                        //     this.setState({ tomorrow: treeData });
                        // }
                    }}
                    dndType="blocks"
                    onMoveNode={(node) => this.moveNode(node, parent_el, true)}
                    rowHeight={20}
                    getNodeKey={(treeIndex) => treeIndex}
                    canNodeHaveChildren={() => {return false}}
                    generateNodeProps={(rowInfo) => {
                          const { node } = rowInfo;
                          return {
                            className: `${rowInfo.node.type}`,
                            style: {
                              height: "17px",
                              fontSize: "12px",
                              marginTop: "3px",
                              width: "100%",
                              border: "1px solid #787a80",
                              borderRadius: "5px",
                              },
                          buttons: rowInfo.node.type === 'TaskBlock' ? [
                              <label className="checkbox-container browser-default">
                                  <input className="browser-default" checked={rowInfo.node.completed} type="checkbox" />
                                  <span className="checkbox-element browser-default" onClick={(node) => this.completeTask()}></span>
                              </label>
                          ] : []
                          };
                      }}/>
                  </div>);
          } else if (this.state.view[i] === "hourly") {
              let newTree = [];
              if (tree) {
                  newTree = tree;
              }

              sortableElement =
                  hours[i].map((el, i) =>
                   <div className={styles.hour} key={el} style={{height: '100%', display: 'flex', width: '100%'}}>
                      {el !== "general" && <div className={styles.hourNumber}>{format(el, "ha").toLowerCase()}</div>}
                      <SortableTree
                        key={el+i}
                        treeData={el !== "general" ? newTree[format(el, "ha")] : newTree["general"]}
                        onMoveNode={(node) => {
                            if (el === "general") {
                                this.moveNode(node, parent_el, true);
                            } else {
                                this.moveNode(node, el, false);
                            }}
                        }
                        dndType="blocks"
                        onChange={treeData => {
                            // if (i === 0) {
                            //     this.setState({ yesterday: treeData})
                            // } else if (i === 1) {
                            //     this.setState({ today: treeData})
                            // } else {
                            //     this.setState({ tomorrow: treeData });
                            // }
                        }}
                        rowHeight={20}
                        generateNodeProps={(rowInfo) => {
                              const { node } = rowInfo;
                              return {
                                className: `${rowInfo.node.type}`,
                                style: {
                                  height: "17px",
                                  fontSize: "12px",
                                  marginTop: "3px",
                                  width: "100%",
                                  border: "1px solid #787a80",
                                  borderRadius: "5px",
                                  },
                              buttons: rowInfo.node.type === 'TaskBlock' ? [
                                  <label className="checkbox-container browser-default">
                                      <input className="browser-default" checked={rowInfo.node.completed} type="checkbox" />
                                      <span className="checkbox-element browser-default" onClick={(node) => this.completeTask()}></span>
                                  </label>
                              ] : []
                              };
                          }}/>
                      </div>
                  );
          }
          return sortableElement;
      }
      moveNode(node, date, general) {
          // console.log("calendar");
          // console.log(node);
          // scheduledDates = scheduledDates.map((object) => {
          //     let dayObject = new Date(object);
          //     return format(dayObject, "eee MMM dd, yyyy");
          // });
          //
          // if (scheduledDates.includes(String(format(date,  "eee MMM dd, yyyy"))))) {
          //     node.node.scheduled.splice(node.prevPath, 1);;
          // }

          const payloadNode = {
              time: date,
              block: node.node._id,
              treeIndex: node.treeIndex,
              general: general
          }
          console.log(date);
          console.log(general);
          //eventId = this.props.updateEvent(payloadNode);
        //  console.log(eventId)
          node.node.scheduled.splice(node.path, 0, payloadNode);
          this.props.updateBlock(node.node);
          this.props.fetchEvents();
      }

    render() {
        const dayFormat = "eee MMM dd, yyyy";
        const hourFormat = "ha";
        const { currentDay } = this.state;
        const yesterday = subDays(currentDay, 1);
        const tomorrow  = addDays(currentDay, 1);
        const days = [yesterday, currentDay, tomorrow];

        const hours = [eachHourOfInterval({
          start: startOfDay(yesterday),
          end: endOfDay(yesterday)
        }),eachHourOfInterval({
          start: startOfDay(currentDay),
          end: endOfDay(currentDay)
      }),eachHourOfInterval({
        start: startOfDay(tomorrow),
        end: endOfDay(tomorrow)
    })];
        hours[0].unshift('general');
        hours[1].unshift('general');
        hours[2].unshift('general');

        const treeNames = ['yesterday', 'today', 'tomorrow'];

        return (
            <Frame className={styles.dailyCalendar}>
                <Header className={`${styles.header} row flex-middle`}>
                    <div className="col col-start">
                        <Button className="icon" onClick={this.prevDay}>chevron_left</Button>
                    </div>
                    <div className="col col-end">
                        <Button className="icon" onClick={this.nextDay}>chevron_right</Button>
                    </div>
                </Header>
                <Body className={styles.dayBody}>
                    {
                        days.map((parent_el, i) => {
                           let tree = this.state.events[format(parent_el, dayFormat)];
                            return (<Day key={`${parent_el}${i}`} className={`${i%2 ? styles.today : styles.outerDays } ${styles.day} day`}>
                                <div className={styles.dayHeader}>
                                    <span className={styles.dayTitle}>{format(parent_el, dayFormat)}</span><div className="view-change">
                                        <Button onClick={() => this.setView(i, "basic")} className="icon view-toggle">crop_landscape</Button>
                                        <Button onClick={() => this.setView(i, "hourly")} className="icon view-toggle">format_list_numbered</Button>
                                    </div>
                                </div>
                                <div className={styles.sortableElement}>
                                    {this.sortableElement(parent_el, tree, hours, i)}
                                </div>
                            </Day>);
                        })}
                </Body>
            </Frame>
        )
    }
}

export default DailyCalendar;
