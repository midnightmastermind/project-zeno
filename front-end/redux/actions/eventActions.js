import axios from "axios";
import { getHours, startOfDay, startOfHour, endOfDay, addDays, subDays, getUnixTime, setDate, eachHourOfInterval, eachWeekOfInterval, eachDayOfInterval, getDay, getDate, format, startOfWeek, startOfMonth, addMonths, endOfWeek, endOfMonth, isSameMonth, isSameDay, toDate, subMonths, getDaysInMonth} from "date-fns";

import {
  REQUEST_EVENTS,
  RECEIVE_EVENTS,
  GET_ERRORS
} from "../types";


export const fetchEvents = dispatch => {
  return dispatch => {
    dispatch(requestEvents())
    return axios
    .get("/api/events")
    .then(res => {
      const events = res.data;
      const sortedEvents = {};
        events.map((block) => {
            let time = new Date(block.time);
            let day = format(time, "eee MMM dd, yyyy");
            let hour = startOfHour(time);
            hour = format(hour, "ha")

            if (!sortedEvents[day]) {
                sortedEvents[day] = {};
            }
            if (block.general) {
                if(!sortedEvents[day]["general"]) {
                    sortedEvents[day]["general"] = [];
                }
                sortedEvents[day]["general"].push(block.block);
            } else {
                if(!sortedEvents[day][hour]) {
                    sortedEvents[day][hour] = [];
                }
                sortedEvents[day][hour].push(block.block);
            }
        });

      dispatch(receiveEvents(sortedEvents));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    })
    );
   }
};

export const updateEvent = eventObj => dispatch => {
  let requestUrl;
  if (eventObj._id) {
        requestUrl = '/api/events/' + eventObj._id + '/update';
  } else {
       requestUrl = '/api/events/create';
  }
  axios
    .post(requestUrl, eventObj)
    .then(res => {
      dispatch(fetchEvents());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );

};
export const receiveEvents = eventsObj => {
  return {
    type: RECEIVE_EVENTS,
    events: eventsObj
  };
};

export const requestEvents = () => {
    return {
        type: REQUEST_EVENTS
    };
};
