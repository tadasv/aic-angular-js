'use strict';

var f = (function() {
  var f = {};
  return f;
}());


f.interest = (function() {
  var interest = {};

  interest.accruedInterest = function() {
    var _aI = {
      // defaults
      _daysInYear: 360,
      _annualInterestRate: 0.04,  // 4 %
      _holdingPeriodInDays: 30,
      _principal: 1000,
    };

    _aI.daysInYear = function(daysInYear) {
      this._daysInYear = daysInYear;
      return this;
    }

    _aI.annualInterestRate = function(rate) {
      this._annualInterestRate = rate / 100.0;
      return this;
    }

    _aI.principal = function(principal) {
      this._principal = principal;
      return this;
    }

    _aI.holdingPeriodInDays = function(days) {
      this._holdingPeriodInDays = days;
      return this;
    }

    _aI.principal = function(principal) {
      this._principal = principal;
      return this;
    }

    _aI.get = function() {
      var fraction = this._holdingPeriodInDays / this._daysInYear;
      return this._principal * fraction * this._annualInterestRate;
    }

    return _aI;
  }

  return interest;
}());
