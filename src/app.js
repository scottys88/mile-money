import {MDCTemporaryDrawer} from '@material/drawer';
import {MDCTopAppBar} from '@material/top-app-bar/index';
import {MDCRipple} from '@material/ripple';

//Button ripple
if(document.querySelector('.mdc-button')){
const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
};

// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
document.querySelector('.menu').addEventListener('click', () => drawer.open = true);

const surface = document.querySelectorAll('.my-surface');
if(surface){
surface.forEach(item => new MDCRipple(item));
};

//Mobile tabs

import {MDCTabBar} from '@material/tab-bar';
import {MDCTab} from '@material/tab';

if(document.querySelector('.mdc-tab-bar')){
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));




const tab = new MDCTab(document.querySelector('.mdc-tab'));
};

//Chips

import {MDCChipSet} from '@material/chips';
if(document.querySelector('.mdc-chip')){
const chipSet = new MDCChipSet(document.querySelector('.mdc-chip'));
};

//Form Fields

import {MDCTextFieldHelperText} from '@material/textfield/helper-text';
import {MDCTextField} from '@material/textfield';
import {MDCTextFieldIcon} from '@material/textfield/icon';
import {MDCFloatingLabel} from '@material/floating-label';

if(document.querySelector('.mdc-text-field')){

const textField = document.querySelectorAll('.mdc-text-field');
textField.forEach(field => new MDCTextField(field));

const floatingLabel = document.querySelectorAll('.mdc-floating-label');
floatingLabel.forEach(label => new MDCFloatingLabel(label));

const helperText = new MDCTextFieldHelperText(document.querySelectorAll('.mdc-text-field-helper-text--persistent'));

const icons = document.querySelectorAll('.mdc-text-field-icon');
icons.forEach(icon => new MDCTextFieldIcon(icon));
}

//Select box option

import {MDCSelect} from '@material/select';

if(document.querySelector('.mdc-select')){
const select = new MDCSelect(document.querySelector('.mdc-select'));
};


//Form Field Icons



//Expand and collapse the commute boxes

const commuteExpand = document.querySelectorAll('.expand-commute');

if(commuteExpand){
function expandCommute(e) {
    const expandButton = e.currentTarget;
    const visibleArea = expandButton.parentElement;
    const expandableArea = visibleArea.nextElementSibling;
    expandableArea.classList.toggle('expanded');
    }
commuteExpand.forEach(commute => commute.addEventListener('click', expandCommute));
}
//Expand and collapse the total Mile Money

const mainCard = document.querySelector('.main-balance');

const redeemedExpand = document.querySelector('.expand-redeemed');


if(redeemedExpand){
const redeemedList = mainCard.querySelectorAll('.redeemed-items-list ul li');
function expandRedeemed(e) {
    const expandButton = e.currentTarget;
    const expandableArea = mainCard.querySelector('.redeemed-items-list');
    expandableArea.classList.toggle('expanded');
    if(redeemedList.length >= 1) {

        }
        else {
            expandableArea.innerHTML = "<p class='nothing-redeemed'>You have nothing redeemed! Add a Wish List item and start saving to your goal!</p>"
        }
    }

redeemedExpand.addEventListener('click', expandRedeemed);
}

//calculate total commute cost auto

const commuteValue = document.querySelectorAll('.commute-value');
const commuteTotal = document.querySelector('.commute-total');


function calculateTotal() {
    let total = Number(0);
    commuteValue.forEach(field => {
        total += (parseFloat(field.value) || 0);

    });
    commuteTotal.value = parseFloat(total);
}

function clearField(e) {
    if(this.value == 0){
        this.value = "";
    }
}

commuteValue.forEach(input => input.addEventListener('focus', clearField));
commuteValue.forEach(input => input.addEventListener('keyup', calculateTotal));
commuteValue.forEach(input => input.addEventListener('input', calculateTotal));

////////////////////////////////Moving tab content for mobile and tablet < 992px

// var mobileCommutesTab = document.querySelector('.commutes-mobile-tab');
// var desktopCommutesCol = document.querySelector('.commutes-wrapper');
// var wishListDesktop = document.querySelector('.wishlist-wrapper');
// var wishListMobileTab = document.querySelector('.wishlist-mobile-tab');
// var commuteCostsDesktop = document.querySelector('.commute-costs-wrapper');
// var commuteCostsMobileTab = document.querySelector('.commuteCosts-mobile-tab');

// // Define our viewportWidth variable
// var viewportWidth;
// // Set/update the viewportWidth value
// var setViewportWidth = function () {
// 	viewportWidth = window.innerWidth || document.documentElement.clientWidth;
// }

// // Log the viewport width into the console
// var logWidth = function () {
// 	if (viewportWidth < 991) {
// 		while (desktopCommutesCol.childNodes.length > 0) {
//             mobileCommutesTab.appendChild(desktopCommutesCol.childNodes[0]);
//         }
//         while (wishListDesktop.childNodes.length > 0) {
//             wishListMobileTab.appendChild(wishListDesktop.childNodes[0]);
//         }
//         while (commuteCostsDesktop.childNodes.length > 0) {
//             commuteCostsMobileTab.appendChild(commuteCostsDesktop.childNodes[0]);
//         }
// 	} else {
//         while (mobileCommutesTab.childNodes.length > 0) {
//             desktopCommutesCol.appendChild(mobileCommutesTab.childNodes[0]);
//         }
//         while (wishListMobileTab.childNodes.length > 0) {
//             wishListDesktop.appendChild(wishListMobileTab.childNodes[0]);
//         }
//         while (commuteCostsMobileTab.childNodes.length > 0) {
//             commuteCostsDesktop.appendChild(commuteCostsMobileTab.childNodes[0]);
//         }
//     }
//     // Set our initial width and log it
// setViewportWidth();
// logWidth();
//     }



// // On resize events, recalculate and log
// window.addEventListener('resize', function () {
// 	setViewportWidth();
// 	logWidth();
// }, false);


//////////hiding and showing content for tabs on

const tabs = document.querySelectorAll('.main-mobile-tab');
var mobileCommutesTab = document.querySelector('.commutes-mobile-tab');
var wishListMobileTab = document.querySelector('.wishlist-mobile-tab');
var commuteCostsMobileTab = document.querySelector('.commuteCosts-mobile-tab');




function tabContent(){
    tabs.forEach(tab => {
        let tabTitleSpan = tab.querySelector('.mdc-tab__text-label');
        if(tab.classList.contains('mdc-tab--active')){
            let tabTitle = tabTitleSpan.textContent;

            switch(tabTitle) {
                case "Wish List":
                    wishListMobileTab.classList.add('active-tab');
                    commuteCostsMobileTab.classList.remove('active-tab');
                    mobileCommutesTab.classList.remove('active-tab');
                    break;
                case "Commute Costs":
                 
                    commuteCostsMobileTab.classList.add('active-tab');
                    wishListMobileTab.classList.remove('active-tab');
                    mobileCommutesTab.classList.remove('active-tab');
                    break;
                case "Commutes":
                 
                    mobileCommutesTab.classList.add('active-tab');
                    commuteCostsMobileTab.classList.remove('active-tab');
                    wishListMobileTab.classList.remove('active-tab');
                    break;
                default:
                    
            }
        } else {
            
        }
    });
}

tabs.forEach(tab => tab.addEventListener('click', tabContent));

//////////Calculate number of commutes for wishlist item

const wishListCards = document.querySelectorAll('.wishlist-card');
const commuteCosts = Array.from(document.querySelectorAll('.commute-card .commute-card-inner-visible-stats--mile-money'));
const dollarValues = commuteCosts.map(x => parseFloat(x.textContent.substr(1)).toFixed(2));
const lastFiveCommutes = dollarValues.slice(0, 4);
const sumOfLastFiveCommutes = lastFiveCommutes.reduce(function (accumulator, currentValue) {
    return accumulator + + currentValue;
  }, 0);


const averageOfLastFiveCommutes = sumOfLastFiveCommutes / lastFiveCommutes.length;

wishListCards.forEach(card => {
    let itemValue = card.querySelector('.wishlist-value').textContent;
    let requiredCommutesField = card.querySelector('.commutes-required');
    const commutesRequired = parseInt(itemValue / averageOfLastFiveCommutes);
    
    requiredCommutesField.innerText = commutesRequired;
});

//Display a different commute icon basded on commute type

const commutes = document.querySelectorAll('.commute-card');

commutes.forEach(commute => {
    let commuteIcon = commute.querySelector('.icon-wrapper .material-icons');
    let commuteType = commute.querySelector('.commute-type').innerText;


    switch(commuteType) {
        case 'Run':
            commuteIcon.innerHTML = "directions_run";
            break;
        case "Walk":
            commuteIcon.innerHTML = "directions_walk";
            break;
        case "Ride":
            commuteIcon.innerHTML = "directions_bike";
            break;
        case "Swim":
            commuteIcon.innerHTML = "pool";
            break;
        case "Hike":
            commuteIcon.innerHTML = "nature";
            break;
        default:
            commuteIcon.innerHTML = "directions_walk";
    }

} )

//Add Mile Money UTM to each Wishlist Link

wishListCards.forEach(item => {
    let itemURL = item.querySelector('.wishlist-card-link-wrapper a');
    let itemValue = item.querySelector('.wishlist-value').textContent;
    let utmTag = "?utm_source=mile%20money&utm_medium=wish%20list%20item&utm_campaign=mile%20money%20io&utm_content=";
    const finalURL = itemURL.setAttribute('href', itemURL + utmTag + itemValue);
    itemURL = finalURL;

})


//Add redeem value to the redeem button on each card


wishListCards.forEach(item => {
    if(!item.classList.contains('.redeemed-wishlist-card')){
        let itemValue = item.querySelector('.wishlist-value').textContent;
        let chipRedeemField = item.querySelector('.redeem-chip-redeem-value');
        if(chipRedeemField) {
            chipRedeemField.textContent = itemValue;
        }
    }
})


//Clear the flashes on screen

const flashClearButton = document.querySelector('.flash-msg-clear');
const flashPanel = document.querySelector('.flash-msg');

if(flashPanel){
function removeFlash(){
    //removes the panel on click
    flashPanel.style.display = "none";
};
    //removes the panel after 15 seconds
setTimeout(removeFlash, 15000);

flashClearButton.addEventListener('click', removeFlash);
};


//Switches for the notifications opt in and opt out
import {MDCSwitch} from '@material/switch';
import { type } from 'os';


let notificationSwitches = Array.from(document.querySelectorAll('.mdc-switch'));
notificationSwitches.forEach(a => { a =  new MDCSwitch(a)});

//Remove the login class from pages that are accessible without logging in

if(window.location.pathname != '/login'){
    document.body.classList.remove('login');
    document.body.removeAttribute('style', 'background-image');
}

// Chart JS

let dates = [];
let graphData = [];
var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
let uniqueCommutes = document.querySelectorAll('.right .commute-card');

function getUniqueMonths() { uniqueCommutes.forEach(activity => {
    let activityMonth = new Date(activity.querySelector('.commute-card-inner-visible-stats--date').innerHTML).getMonth();
    let activityYear = new Date(activity.querySelector('.commute-card-inner-visible-stats--date').innerHTML).getFullYear();
    let activityCost = activity.querySelector('.commute-card-inner-visible-stats--mile-money').innerHTML;

    parseFloat(activityCost);
    let noSpan = activityCost.split('</span>')
    let dollarValue = parseFloat(noSpan[1]);

    let month = monthNames[activityMonth];

    dates.push(month);
    graphData.push({x: month, y: dollarValue});
})}
getUniqueMonths();


const reduced = graphData.reduce(function(m, d){
    if(!m[d.x]){
      m[d.x] = d.y;
      return m;
    }

    m[d.x] += d.y;
    return m;
 },{});



let monthValues = Object.values(reduced);
console.log(monthValues);

let uniqueMonths = [...new Set(dates)]; 

uniqueMonths.reverse();
monthValues.reverse();


var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: { 
        labels: uniqueMonths,
        datasets: [{
            label: "Mile Money",
            backgroundColor: 'rgba(254, 199, 47, 0.73)',
            borderColor: 'rgb(255, 99, 132)',
            data: monthValues,
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        tooltips: {
            callbacks: {
              label: (item) => `${item.yLabel} Mile Money`,
            },
          },
    }
});