"use strict";

var app = angular.module('AICApp', ['ngMaterial']);

app.controller('CalculatorController', ['$scope', '$window', function($scope, $window) {
  this.initialAmount = 1000;
  this.interestRate = 4.0;
  this.holdingPeriod = 1;
  this.dividendPayout = 0.0;
  this.dividendPeriod = 10;
  this.totalInterest = 0.0;
  this.totalCompoundInterest = 0.0;
  this.bondTypes = [
    {
      id: 1, name: 'Corporate and Municipal', daysInYear: 360
    },
    {
      id: 2, name: 'Government', daysInYear: 365
    },
  ];
  this.selectedBondType = this.bondTypes[0];
  this.interestData = [];

  this.calculateInterest = function() {
    var aI = $window.f.interest.accruedInterest()
            .daysInYear(this.selectedBondType.daysInYear)
            .annualInterestRate(this.interestRate)
            .principal(this.initialAmount);

    var interestData = [];
    for (var i = 1; i <= this.holdingPeriod; i++) {
      var interest = aI.holdingPeriodInDays(i).get();
      interestData.push({
        day: i,
        interest: interest,
        dividend: 0.0,
      });
    }
    
    this.interestData = interestData;
    this.totalInterest = this.interestData[this.interestData.length - 1].interest;
  }

  this.calculateInterest();
}]);

app.directive('interestTable', function($parse, $window, $filter, $rootScope) {
  return {
    restrict: 'EA',
    template: '<md-list id="interest-table">\
    <div layout="row" layout-align="center center">\
      <md-subheader flex="30">Day</md-subheader>\
      <md-subheader flex="30">Dividend</md-subheader>\
      <md-subheader flex="30">Accrued Interest</md-subheader>\
    </div>\
    </md-list>',
    link: function(scope, elem, attrs) {
       var currencyFilter = $filter('currency');
       var exp = $parse(attrs.tableData);
       var data = exp(scope);

       var everyRow = $parse(attrs.every)(scope);

       var d3 = $window.d3;
       var rawList = elem.find('md-list');
       var list = d3.select(rawList[0]);

       scope.$watchCollection(exp, function(newVal, oldVal){
           data = newVal;
           update();
       });

       function update() {
         var filteredData = [];
         for (var i = 0; i < data.length; i++) {
           if (i % everyRow == 0) {
             filteredData.push(data[i]);
           } else if (i + 1 == data.length) {
             // always include the last one.
             filteredData.push(data[i]);
           }
         }

         var listItem = list.selectAll('md-list-item')
                .data(filteredData)
                .each(function(d) {
                  d3.select(this).select('.day').text(d.day);
                  d3.select(this).select('.dividend').text(currencyFilter(d.dividend, '$ '));
                  d3.select(this).select('.interest').text(currencyFilter(d.interest, '$ '));
                });

         var listItemEnter = listItem
                .enter()
                  .append('md-list-item')
                  .attr('layout', 'row')
                .each(function(d) {
                  d3.select(this).append('div')
                    .attr('class', 'day flex-30')
                    .text(d.day);
                  d3.select(this).append('div')
                    .attr('class', 'dividend flex-30')
                    .text(currencyFilter(d.dividend, '$ '));
                  d3.select(this).append('div')
                    .attr('class', 'interest flex-30')
                    .text(currencyFilter(d.interest, '$ '));
                });

         listItem.exit().remove();
       }
    }
  };
});
