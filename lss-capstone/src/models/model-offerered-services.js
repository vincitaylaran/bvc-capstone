import { observable } from "mobx";
import React from "react";
import { Link } from "react-router-dom";

export const ModelOfferred = observable({
  findOfferString: "",
  paging: {
    page: 1,
    row: 5
  },
  bookingType: "",
  service: "",
  offers: [
    <Link to="/walkin-book/CTTutor">
      Creative Technologies Tutorials (Walk-In)
    </Link>,
    <Link to="/walkin-book/PNTutor">Practical Nursing Tutorials (Walk-In)</Link>,
    <Link to="/walkin-book/Reboot">Reboot Tutorials (Walk-In)</Link>,
    <Link to="/walkin-book/ELL">
      English Language Learning Tutorials (Walk-In)
    </Link>,
    <Link to="/appointment/ELL">English Language Learning (Appointment)</Link>,
    <Link to="/appointment/CTTutor">Creative Technologies (Appointment)</Link>,
    <Link to="/appointment/PNTutor">Practical Nursing (Appointment)</Link>
  ]
});

/******************************
     Get and Set functions
 ******************************/

ModelOfferred.setBookingType = function(value) {
  this.bookingType = value;
};

ModelOfferred.setService = function(value) {
  this.service = value;
};

ModelOfferred.getBookingType = function() {
  return this.bookingType;
};

ModelOfferred.getService = function() {
  return this.service;
};

ModelOfferred.setPageNumber = function(value) {
  this.paging.page = this.paging.page + value;
};
ModelOfferred.getPageNumber = function() {
  return this.paging.page;
};
ModelOfferred.setPageRow = function(value) {
  if (value === -1) this.paging.row = this.offers.length;
  else this.paging.row = value;
};
ModelOfferred.getPageRow = function() {
  return this.paging.row;
};
ModelOfferred.getOffers = function() {
  return this.offers;
};
