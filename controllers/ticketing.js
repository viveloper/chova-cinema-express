const immer = require('immer');
const { getRandomInt, getS3FullPath } = require('../utils');
const { query } = require('../api');

// @desc    Get ticketing info
// @route   GET /api/ticketing
// @access  Public
exports.getTicketingData = async (req, res, next) => {
  const ticketingData = await query({
    key: 'ticketing',
    url: `/data/ticketing/ticketingData.json`,
  });

  res.status(200).json(ticketingData);
};

// @desc    Get movie play sequence
// @route   GET /api/ticketing/playSequence
// @access  Public
exports.getPlaySequence = async (req, res, next) => {
  const playDate = req.query.playDate;
  const divisionCode = req.query.divisionCode;
  const detailDivisionCode = req.query.detailDivisionCode;
  const cinemaId = req.query.cinemaId;
  const movieCode = req.query.movieCode;

  const playSequence = await query({
    key: `playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}`,
    url: `/data/ticketing/playSeqs/playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`,
  });

  const filteredPlaySequence = !movieCode
    ? playSequence
    : {
        ...playSequence,
        PlaySeqsHeader: {
          ...playSequence.PlaySeqsHeader,
          Items: playSequence.PlaySeqsHeader.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ),
          ItemCount: playSequence.PlaySeqsHeader.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ).length,
        },
        PlaySeqs: {
          ...playSequence.PlaySeqs,
          Items: playSequence.PlaySeqs.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ),
          ItemCount: playSequence.PlaySeqs.Items.filter(
            (item) => item.RepresentationMovieCode === movieCode
          ).length,
        },
      };

  res.status(200).json(
    immer.produce(filteredPlaySequence, (draft) => {
      draft.PlaySeqs.Items.forEach((item) => {
        item.PosterURL = getS3FullPath(item.PosterURL);
      });
    })
  );
};

// @desc    Get seats
// @route   GET /api/ticketing/seats
// @access  Public
exports.getSeats = async (req, res, next) => {
  const playDate = req.query.playDate;
  const cinemaId = req.query.cinemaId;
  const screenDivisionCode = req.query.screenDivisionCode;
  const screenId = req.query.screenId;
  const playSequence = req.query.playSequence;

  const seats = await query({
    key: `seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}`,
    url: `/data/ticketing/seats/seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}.json`,
  });

  res.status(200).json(seats);
};

// @desc    Get userTicketing
// @route   GET /api/ticketing/userTicketing
// @access  Private
exports.getUserTicketingList = async (req, res, next) => {
  const userId = req.user.id;

  const userTicketingData = await query({
    key: 'userTicketing',
    url: `/data/ticketing/userTicketingData.json`,
  });

  const userTicketingList = userTicketingData.ticketingList.filter(
    (item) => item.userId === userId
  );

  res.status(200).json({
    userTicketingList: immer.produce(userTicketingList, (draft) => {
      draft.forEach((item) => {
        item.posterUrl = getS3FullPath(item.posterUrl);
      });
    }),
  });
};

// @desc    Add userTicketing
// @route   POST /api/ticketing/userTicketing
// @access  Private
exports.addUserTicketing = async (req, res, next) => {
  const {
    movieCode,
    movieName,
    posterUrl,
    viewGradeCode,
    divisionCode,
    detailDivisionCode,
    cinemaId,
    cinemaName,
    screenId,
    screenName,
    screenDivisionCode,
    screenDivisionName,
    playSequence,
    playDate,
    playDay,
    startTime,
    endTime,
    seatNoList,
    price,
  } = req.body;

  const loginUser = req.user;

  // User Ticketing Data Update
  const userTicketingData = await query({
    key: 'userTicketing',
    url: `/data/ticketing/userTicketingData.json`,
  });

  const ticketingId = getRandomInt(10000000, 1000000000);
  const userTicketing = {
    ticketingId,
    userId: loginUser.id,
    movieCode,
    movieName,
    posterUrl,
    viewGradeCode,
    divisionCode,
    detailDivisionCode,
    cinemaId,
    cinemaName,
    screenId,
    screenName,
    screenDivisionCode,
    screenDivisionName,
    playSequence,
    playDate,
    playDay,
    startTime,
    endTime,
    seatNoList,
    price,
  };

  userTicketingData.ticketingList.push(userTicketing);

  // Seats Data Update
  const seatsData = await query({
    key: `seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}`,
    url: `/data/ticketing/seats/seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}.json`,
  });

  seatNoList.forEach((seatNo) => {
    // Seats update
    const targetSeat = seatsData.Seats.Items.find(
      (seat) => seat.SeatNo === seatNo
    );
    targetSeat.SeatStatusCode = 50;

    // BookingSeats update
    seatsData.BookingSeats.Items.push({
      SeatNo: targetSeat.SeatNo,
      SeatRow: targetSeat.SeatRow,
      SeatColumn: targetSeat.SeatColumn,
      SeatColumnGroupNo: targetSeat.SeatColumGroupNo,
      ShowSeatRow: targetSeat.ShowSeatRow,
      ShowSeatColumn: targetSeat.ShowSeatColumn,
    });
  });

  // PlaySequence data update
  const playSeqsData = await query({
    key: `playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}`,
    url: `/data/ticketing/playSeqs/playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`,
  });
  const targetPlaySeqsData = playSeqsData.PlaySeqs.Items.find(
    (item) => item.ScreenID === screenId && item.PlaySequence === playSequence
  );
  targetPlaySeqsData.BookingSeatCount -= seatNoList.length;

  // User Data Update
  const usersData = await query({
    key: 'users',
    url: `/data/users/users.json`,
  });
  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  if (!targetUser.ticketingList.length) {
    targetUser.ticketingList = [ticketingId];
  } else {
    targetUser.ticketingList.push(ticketingId);
  }

  res.status(200).json({
    userTicketing,
  });
};

// @desc    Delete userTicketing
// @route   DELETE /api/ticketing/userTicketing/:ticketingId
// @access  Private
exports.deleteUserTicketing = async (req, res, next) => {
  const ticketingId = parseInt(req.params.ticketingId);

  const loginUser = req.user;

  // User Ticketing Data Update
  const userTicketingData = await query({
    key: 'userTicketing',
    url: `/data/ticketing/userTicketingData.json`,
  });
  const targetUserTicketing = userTicketingData.ticketingList.find(
    (userTicketing) => userTicketing.ticketingId === ticketingId
  );
  userTicketingData.ticketingList = userTicketingData.ticketingList.filter(
    (userTicketing) => userTicketing.ticketingId !== ticketingId
  );

  // Seats Data Update
  const {
    divisionCode,
    detailDivisionCode,
    cinemaId,
    screenId,
    screenDivisionCode,
    playSequence,
    playDate,
    seatNoList,
  } = targetUserTicketing;

  const seatsData = await query({
    key: `seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}`,
    url: `/data/ticketing/seats/seatsInfo-${playDate}-${cinemaId}-${screenDivisionCode}-${screenId}-${playSequence}.json`,
  });

  seatNoList.forEach((seatNo) => {
    // Seats update
    const targetSeat = seatsData.Seats.Items.find(
      (seat) => seat.SeatNo === seatNo
    );
    targetSeat.SeatStatusCode = 0;

    // BookingSeats update
    const targetBookingSeatIdx = seatsData.BookingSeats.Items.findIndex(
      (item) => item.SeatNo === seatNo
    );
    seatsData.BookingSeats.Items.splice(targetBookingSeatIdx, 1);
  });

  // PlaySequence data update
  const playSeqsData = await query({
    key: `playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}`,
    url: `/data/ticketing/playSeqs/playSeqs-${playDate}-${divisionCode}-${detailDivisionCode}-${cinemaId}.json`,
  });

  const targetPlaySeqsData = playSeqsData.PlaySeqs.Items.find(
    (item) => item.ScreenID === screenId && item.PlaySequence === playSequence
  );
  targetPlaySeqsData.BookingSeatCount += seatNoList.length;

  // User Data Update
  const usersData = await query({
    key: 'users',
    url: `/data/users/users.json`,
  });

  const targetUser = usersData.users.find(
    (user) => user.email === loginUser.email
  );

  const targetTicketingIdx = targetUser.ticketingList.indexOf(ticketingId);
  targetUser.ticketingList.splice(targetTicketingIdx, 1);

  res.status(200).json({
    success: true,
    userTicketing: targetUserTicketing,
  });
};
