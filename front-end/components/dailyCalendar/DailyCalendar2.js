import React, {Component} from 'react';
import styled from 'styled-components';
import { startOfDay, endOfDay, addDays, subDays, getUnixTime, setDate, eachHourOfInterval, eachWeekOfInterval, eachDayOfInterval, getDay, getDate, format, startOfWeek, startOfMonth, addMonths, endOfWeek, endOfMonth, isSameMonth, isSameDay, toDate, subMonths, getDaysInMonth} from "date-fns";
import { chunk } from 'lodash';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import SortableTree from "react-sortable-tree";

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

        this.state = {
            currentDay: props.selectedDate || new Date(),
            treeData: []
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

    render() {
        const dayFormat = "eee MMM dd, yyyy";
        const hourFormat = "ha";
        const { currentDay } = this.state;
        const yesterday = subDays(currentDay, 1);
        const tomorrow  = addDays(currentDay, 1);
        const days = [yesterday, currentDay, tomorrow];
        const hours = eachHourOfInterval({
          start: startOfDay(currentDay),
          end: endOfDay(currentDay)
        });

        return (
            <Frame className="daily-calendar">
                <Header className="header row flex-middle">
                    <div className="col col-start">
                        <Button className="icon" onClick={this.prevDay}>chevron_left</Button>
                    </div>
                    <div className="col col-end">
                        <Button className="icon" onClick={this.nextDay}>chevron_right</Button>
                    </div>
                </Header>
                <Body className="body">
                    {
                        days.map((parent_el, i) =>
                            <Day key={`${parent_el}${i}`} className={`${i%2 ? 'today' : 'outer-days' }`}>
                                <span className="day-title">{format(parent_el, dayFormat)}</span>
                                <div className="day">
                                    <div className="hour" style={{height: '68px', display: 'flex', width: '100%'}}>
                                        <div className="hour-number">General</div>
                                    </div>
                                    {
                                        hours.map((el, i) =>
                                         <div className="hour" key={parent_el+el} style={{height: '68px', display: 'flex', width: '100%'}}>
                                            <div className="hour-number">{format(el, hourFormat).toLowerCase()}</div>
                                            <SortableTree
                                              key={i}
                                              treeData={this.state.treeData}
                                              onChange={treeData => this.setState({ treeData })}
                                              dndType="blocks"
                                              rowHeight={20}
                                              generateNodeProps={(rowInfo) => {
                                                    const { node } = rowInfo;
                                                    return {
                                                      style: {
                                                        height: "17px",
                                                        fontSize: "12px",
                                                        marginTop: "3px",
                                                        width: "100%",
                                                        border: "1px solid #787a80",
                                                        borderRadius: "5px",
                                                      }
                                                    };
                                                }}/>
                                            </div>
                                            )
                                        }
                                </div>
                            </Day>
                        )}
                </Body>
            </Frame>
        )
    }
}

export default DailyCalendar;
