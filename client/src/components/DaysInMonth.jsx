import React from 'react';
import moment from 'moment';
import Day from './Day.jsx';


class DaysInMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateObject: this.props.month,
      highLight: false,

    };

    this.daysInMonth = this.daysInMonth.bind(this);
    this.firstDayOfMonth = this.firstDayOfMonth.bind(this);
    this.daysInMonth = this.daysInMonth.bind(this);
    this.blanksDays = this.blanksDays.bind(this);
    this.totalSlots = this.totalSlots.bind(this);

    this.bookedDay = this.bookedDay.bind(this);
    this.blackOutMinNights = this.blackOutMinNights.bind(this);

    this.showMinNights = this.showMinNights.bind(this);
    this.noMinNights = this.noMinNights.bind(this);
  }


  firstDayOfMonth() {
    const { dateObject } = this.state;
    const firstDay = moment(dateObject).startOf('month').format('d');

    return firstDay;
  }

  bookedDay(date) {
    // convert the day to moment;
    // console.log(date);

    const booked = this.props.listing.bookings;
    if (booked !== undefined) {
      // console.log(booked);
      for (let i = 0; i < booked.length; i += 1) {
        const trimDate = booked[i].split('T')[0];

        // console.log('any day ===', trimDate === date);
        if (trimDate === date) {
          return true;
        }
      }
    }
    return false;
    // console.log('booked contains', booked.includes(day));
  }

  blackOutMinNights(date) {
    // add min nights to selected date
    // console.log(date);
    const checkInDate = new Date(this.props.checkInDate);
    const { minNights } = this.props;


    const minBookDate = new Date(checkInDate);
    minBookDate.setDate(checkInDate.getDate() + minNights);

    // console.log('checkinDate:', checkInDate);
    // console.log('minimum days to book', minBookDate);

    if (date > checkInDate && date < minBookDate) {
      console.log('This day falls between checkin and minbookdate', date);
      return true;
    }
    return false;
  }

  inMinNights(date) {
    const checkInDate = new Date(this.props.checkInDate);
    const { minNights } = this.props;


    const minBookDate = new Date(checkInDate);
    minBookDate.setDate(checkInDate.getDate() + minNights);

    // console.log('checkinDate:', checkInDate);
    // console.log('minimum days to book', minBookDate);

    if (date > checkInDate && date <= minBookDate) {
      console.log('This day falls between checkin and minbookdate', date);
      return true;
    }
    return false;
  }

  showMinNights() {
    console.log('show min ngihts called!');
    this.setState({ highLight: true });
  }

  noMinNights() {
    console.log('nominnights called!!');
    this.setState({ highLight: false });
  }


  daysInMonth() {
    const { dateObject } = this.state;
    const totalDaysInMonth = moment(dateObject).daysInMonth();
    const { bookings } = this.props.listing;

    // console.log('bookings', bookings);
    const month = moment(dateObject).format('MM');
    const year = moment(dateObject).format('YYYY');


    // console.log('month', month);
    // console.log('year', year);
    const daysInMonth = [];
    for (let d = 1; d <= totalDaysInMonth; d += 1) {
      const day = d > 9 ? d : `0${d}`;
      const date = `${year}-${month}-${day}`;
      // const booked = this.bookedDay(date) ? 'booked' : '';

      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const beforeCurrent = new Date(date) < currentDate;

      // const beforeCheckIn = new Date(date) < new Date(this.props.checkInDate);

      const afterLastDay = false;
      if (this.props.lastDay !== null) {
        const lastDay = new Date(date) > new Date(this.props.lastDay);
        if (lastDay) {
          afterLastDay = true;
        }
      }

      // if render all we dont care about checkin now
      const beforeCheckIn = false;
      if (!this.props.renderAll) {
        beforeCheckIn = new Date(date) < new Date(this.props.checkInDate);
      }

      const selected = false;

      if (this.props.checkInDate !== null && this.props.checkOutDate !== null) {
        const selectDate = new Date(date);
        if (selectDate >= new Date(this.props.checkInDate) && selectDate <= new Date(this.props.checkOutDate)) {
          selected = true;
        }
      }


      let blackOutMinNights = false;
      if (this.props.checkInDate !== null) {
        if (date === this.props.checkInDate) {
          selected = true;
        }
        if (selected === false) {
          if (this.blackOutMinNights(new Date(date))) {
            console.log('this day is in min nights!', date);
            blackOutMinNights = true;
          }
        }
      }

      const minDate = false;
      if (this.inMinNights(new Date(date)) && this.state.highLight) {
        minDate = true;
        console.log('falls in min nights!');
      }

      if (this.bookedDay(date) || beforeCurrent || beforeCheckIn || afterLastDay || blackOutMinNights) {
        daysInMonth.push(<Day
          d={d}
          booked="true"

        />);
      } else {
        daysInMonth.push(<Day
          d={d}
          booked="false"
          checkInDate={this.props.checkInDate}
          checkDate={date}
          setCheckIn={this.props.setCheckIn}
          selected={selected}
          minNights={this.props.minNights}
          highLight={minDate}
          noMinNights={this.noMinNights}
          showMinNights={this.showMinNights}

        />);
      }
    }
    return daysInMonth;
  }

  blanksDays() {
    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      blanks.push(
        <td className="calendar-day empty" />,
      );
    }
    return blanks;
  }

  totalSlots() {
    const blanks = this.blanksDays();
    const daysInMonth = this.daysInMonth();

    const totalSlots = [...blanks, ...daysInMonth];
    const rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });

    const daysinmonth = rows.map((d, i) => <tr>{d}</tr>);

    return daysinmonth;
  }


  render() {
    return (
      <tbody>
        {this.totalSlots()}
      </tbody>
    );
  }
}

export default DaysInMonth;
