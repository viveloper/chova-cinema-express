const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  MakingNationNameKR: {
    type: 'String',
  },
  MakingNationNameUS: {
    type: 'String',
  },
  MakingNationName: {
    type: 'Mixed',
  },
  MovieGenreCode: {
    type: 'String',
  },
  PlayTime: {
    type: 'Number',
  },
  SoundTypeCode: {
    type: 'String',
  },
  SoundTypeNameKR: {
    type: 'String',
  },
  SoundTypeNameUS: {
    type: 'String',
  },
  FourDTypeCode: {
    type: 'String',
  },
  FourDTypeNameKR: {
    type: 'String',
  },
  FourDTypeNameUS: {
    type: 'String',
  },
  TranslationDivisionCode: {
    type: 'String',
  },
  TranslationDivisionNameKR: {
    type: 'String',
  },
  TranslationDivisionNameUS: {
    type: 'String',
  },
  HomepageURL: {
    type: 'String',
  },
  SynopsisKR: {
    type: 'String',
  },
  SynopsisUS: {
    type: 'String',
  },
  Synopsis: {
    type: 'Mixed',
  },
  TotalViewCount: {
    type: 'Number',
  },
  AgePrefer10: {
    type: 'String',
  },
  AgePrefer20: {
    type: 'String',
  },
  AgePrefer30: {
    type: 'String',
  },
  AgePrefer40: {
    type: 'String',
  },
  ManPrefer: {
    type: 'String',
  },
  WomanPrefer: {
    type: 'String',
  },
  KOFCustCnt: {
    type: 'Number',
  },
  AggrDt: {
    type: 'String',
  },
  MakingNationNameKR2: {
    type: 'String',
  },
  MakingNationNameKR3: {
    type: 'String',
  },
  MovieGenreNameKR2: {
    type: 'String',
  },
  MovieGenreNameKR3: {
    type: 'String',
  },
  RepresentationMovieCode: {
    type: 'String',
  },
  MoviePlayYN: {
    type: 'String',
  },
  MoviePlayEndYN: {
    type: 'Number',
  },
  MovieNameKR: {
    type: 'String',
  },
  MovieNameUS: {
    type: 'String',
  },
  MovieName: {
    type: 'Mixed',
  },
  PosterURL: {
    type: 'String',
  },
  ViewGradeCode: {
    type: 'Number',
  },
  ViewGradeNameKR: {
    type: 'String',
  },
  ViewGradeNameUS: {
    type: 'String',
  },
  ViewGradeName: {
    type: 'Mixed',
  },
  BookingRate: {
    type: 'Number',
  },
  ReleaseDate: {
    type: 'String',
  },
  DDay: {
    type: 'Mixed',
  },
  ExpectEvaluation: {
    type: 'Number',
  },
  ViewEvaluation: {
    type: 'Number',
  },
  Evaluation: {
    type: 'Number',
  },
  BookingYN: {
    type: 'String',
  },
  ViewRate: {
    type: 'Number',
  },
  SpecialScreenDivisionCode: {
    type: ['String'],
  },
  SoloOpenYN: {
    type: 'Mixed',
  },
  OpenORClosing: {
    type: 'Number',
  },
  BookingRank: {
    type: 'String',
  },
  ViewSortSequence: {
    type: 'Mixed',
  },
  BookingSortSequence: {
    type: 'Mixed',
  },
  FilmCode: {
    type: 'String',
  },
  FilmName: {
    type: 'String',
  },
  MovieFestivalID: {
    type: 'Number',
  },
  DirectorName: {
    type: 'Mixed',
  },
  ActorName: {
    type: 'Mixed',
  },
  MovieGenreNameKR: {
    type: 'String',
  },
  MovieGenreNameUS: {
    type: 'String',
  },
  MovieGenreName: {
    type: 'Mixed',
  },
  ProductionCompanyName: {
    type: 'String',
  },
  MovieDivisionCode: {
    type: 'Mixed',
  },
  MovieFestivalName: {
    type: 'Mixed',
  },
  MovieFestivalFilmCount: {
    type: 'Mixed',
  },
  MovieFestivalOpenDate: {
    type: 'Mixed',
  },
  MovieFestivalFinalDate: {
    type: 'Mixed',
  },
  MovieFestivalOpenMovieCode: {
    type: 'Mixed',
  },
  MovieFestivalOpenMovieName: {
    type: 'Mixed',
  },
  MovieFestivalFinalMovieCode: {
    type: 'Mixed',
  },
  MovieFestivalFinalMovieName: {
    type: 'Mixed',
  },
  ImagePath: {
    type: 'Mixed',
  },
  ImageALT: {
    type: 'Mixed',
  },
  LinkDivisionCode: {
    type: 'Mixed',
  },
  ParameterEventID: {
    type: 'Mixed',
  },
  ParameterRepMovieCode: {
    type: 'Mixed',
  },
  URL: {
    type: 'Mixed',
  },
  PopupTitle: {
    type: 'Mixed',
  },
  KOFMovieCd: {
    type: 'Mixed',
  },
  PlanedRelsYN: {
    type: 'Number',
  },
  PlanedRelsMnth: {
    type: 'String',
  },
  KeywordID: {
    type: 'Mixed',
  },
  KeywordNm: {
    type: 'Mixed',
  },
  MoreLookCD: {
    type: 'Mixed',
  },
  MoreLookUrl: {
    type: 'Mixed',
  },
  MoreLookImgUrl: {
    type: 'Mixed',
  },
  MoreLookImgAlt: {
    type: 'Mixed',
  },
  UpdateYn: {
    type: 'Mixed',
  },
  ArrayStandardCd: {
    type: 'Mixed',
  },
  UpdateDt: {
    type: 'Mixed',
  },
  LikeYN: {
    type: 'String',
  },
  ViewCount: {
    type: 'Number',
  },
  LikeCount: {
    type: 'Number',
  },
  TargetMovieListCode: {
    type: 'Number',
  },
  ViewCountSortSequence: {
    type: 'Number',
  },
  Casting: {
    type: ['Mixed'],
  },
  Trailer: {
    type: ['Mixed'],
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
