import React, {Component} from 'react';
import MonthlyCalendar from "../monthlyCalendar";
import DailyCalendar from "../dailyCalendar";
import styled from 'styled-components';
import styles from "./styles.module.scss";
import { fetchBlocks, updateBlock } from "../../redux/actions/blockActions";
import { fetchEvents, updateEvent } from "../../redux/actions/eventActions";
import {connect} from 'react-redux';

const CalendarElement = styled.div`
	max-width: 100%;
	height: 100%;
`;

class CalendarContainer extends Component {
		static getInitialProps({store}) {}
    constructor(props) {
        super(props);
        this.toggleView = this.toggleView.bind(this);
        this.state = {
            view: 'daily'
        }
    }
		componentDidMount(){
        //this.props.fetchEvents();
        //this.props.fetchBlocks();
    }
    toggleView(view) {
        this.setState({view: view})
    }
    render() {
        return (
            <div className={`boxContainer fullWidth ${styles.calendarContainer}`}>
                <div className={styles.topHeader}>
                    <h2 className="pageHeading">Calendar</h2>
                    <div className={styles.viewChange}>
                        <span onClick={() => this.toggleView("monthly")} className={`icon view-toggle ${styles.icon}`}>calendar_view_month</span>
                        <span onClick={() => this.toggleView("daily")} className={`icon material-icons ${styles.icon}`}>calendar_today</span>
                    </div>
                </div>
                <CalendarElement>
                    {this.state.view == "monthly" && <MonthlyCalendar fetchEvents={this.props.fetchEvents} updateEvent={this.props.updateEvent} events={this.props.events} updateBlock={this.props.updateBlock} treeData={this.props.treeData} />}
                    {this.state.view == "daily" && <DailyCalendar fetchEvents={this.props.fetchEvents} updateEvent={this.props.updateEvent} events={this.props.events}  updateBlock={this.props.updateBlock} treeData={this.props.treeData} />}
                </CalendarElement>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    blocks: state.blocks,
		events: state.events
});

const mapDispatchToProps = {
    updateBlock: updateBlock,
		fetchBlocks: fetchBlocks,
		updateEvent: updateEvent,
		fetchEvents: fetchEvents
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainer);
