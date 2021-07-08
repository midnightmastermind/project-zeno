import React, {Component} from 'react';
import styled from 'styled-components';
import { getUnixTime, setDate, eachWeekOfInterval, eachDayOfInterval, getDay, getDate, format, startOfWeek, startOfMonth, addMonths, addDays, endOfWeek, endOfMonth, isSameMonth, isSameDay, toDate, subMonths, getDaysInMonth} from "date-fns";
import { chunk } from 'lodash';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import SortableTree from "react-sortable-tree";
import styles from "./styles.module.scss";

const days_of_the_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


const Frame = styled.div`
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
    flex-wrap: wrap;
`;
const WeekDay = styled.div`
    width: 14.2%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const Day = styled.div`
    width: 14.2%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const generateMonth = (selectedDate) => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const startWeekday = getDay(startOfMonth(selectedDate));
    const endWeekday = getDay(endOfMonth(selectedDate));

    const gridDays = chunk([
      ...Array.from({ length: startWeekday }).fill(null),
      ...Array.from({ length: daysInMonth }, (_,i) => setDate(selectedDate, i+1)),
      ...Array.from({ length: (6-endWeekday) }).fill(null)
    ], 7);

    return gridDays;
  }

class MonthlyCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
            treeData: []
        }
    }
    nextMonth = () => {
      this.setState({
        currentMonth: addMonths(this.state.currentMonth, 1)
      });
    };

    prevMonth = () => {
      this.setState({
        currentMonth: subMonths(this.state.currentMonth, 1)
      });
    };
    render() {
        const monthFormat = "MMMM yyyy";
        const weekdayFormat = "eeee";
        const { currentMonth, selectedDate } = this.state;
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);

        return (
            <Frame className={styles.monthlyCalendar}>
                <Header className="header row flex-middle">
                    <div className="col col-start">
                        <Button className="icon" onClick={this.prevMonth}>chevron_left</Button>
                    </div>
                    <div className="col col-center">
                        <span>{format(this.state.currentMonth, monthFormat)}</span>
                    </div>
                    <div className="col col-end">
                        <Button className="icon" onClick={this.nextMonth}>chevron_right</Button>
                    </div>
                </Header>
                <Body className={styles.calendar}>
                    <div className={styles.week}>
                      { days_of_the_week.map(weekday => (
                          <WeekDay className={`col col-center ${styles.weekday}`} key={weekday}>
                              {weekday}
                          </WeekDay>
                      ))}
                    </div>
                    <div className={`${styles.month} scrollable`}>
                    {   generateMonth(currentMonth).map((week, week_index) =>
                            (
                                <div className={`row ${week_index > 4 ? styles.longMonth : ''}`} key={week_index}>
                                    {
                                        week.map((day, day_index) => (
                                            day ?
                                            <Day className={`${styles.col} ${styles.cell} ${styles.day}`} key={day_index}>
                                            <span className={styles.number}>{day ? getDate(day) : ''}</span>
                                            <span className={styles.bg}>{getDate(day)}</span>
                                                <div style={{height: '50px', width: '50px'}}>
                                                   <SortableTree
                                                     key={this.state.currentMonth + day_index}
                                                     treeData={this.state.treeData}
                                                     onChange={treeData => this.setState({ treeData })}
                                                     dndType="blocks"/>
                                                   </div>
                                            </Day>
                                            :
                                            <Day className={`${styles.col} ${styles.cell} ${styles.day}`} key={day_index}>
                                            </Day>
                                        ))
                                    }
                                </div>
                            )
                        )
                    }
                    </div>
                </Body>
            </Frame>
        )
    }
}

export default MonthlyCalendar;
