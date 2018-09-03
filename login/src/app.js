import {MDCTemporaryDrawer} from '@material/drawer';
import {MDCTopAppBar} from '@material/top-app-bar/index';
import {MDCRipple} from '@material/ripple';

// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);

const drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
document.querySelector('.menu').addEventListener('click', () => drawer.open = true);

const surface = document.querySelectorAll('.my-surface');
surface.forEach(item => new MDCRipple(item));

//Mobile tabs

import {MDCTabBar} from '@material/tab-bar';

if(document.querySelector('.mdc-tab-bar')){
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
};

import {MDCTab} from '@material/tab';

const tab = new MDCTab(document.querySelector('.mdc-tab'));

//Chips

import {MDCChipSet} from '@material/chips';

const chipSet = new MDCChipSet(document.querySelector('.mdc-chip'));

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

const redeemedExpand = document.querySelector('.expand-redeemed');

if(redeemedExpand){
function expandRedeemed(e) {
    const expandButton = e.currentTarget;
    const expandableArea = expandButton.nextElementSibling;
    expandableArea.classList.toggle('expanded');
    }

redeemedExpand.addEventListener('click', expandRedeemed);
}

//calculate total commute cost auto

const commuteValue = document.querySelectorAll('.commute-value');
const commuteTotal = document.querySelector('.commute-total');
console.log(commuteValue);

function calculateTotal() {
    let total = 0;
    commuteValue.forEach(field => {
        total += parseInt(field.value);
        console.log(field.value);
    });
    commuteTotal.value = total;
}

function clearField(e) {
    if(this.value == 0){
        this.value = "";
    }
}

commuteValue.forEach(input => input.addEventListener('focus', clearField));
commuteValue.forEach(input => input.addEventListener('change', calculateTotal));


////////////////////////////////Moving tab content for mobile and tablet < 992px

var mobileCommutesTab = document.querySelector('.commutes-mobile-tab');
var desktopCommutesCol = document.querySelector('.commutes-wrapper');
var wishListDesktop = document.querySelector('.wishlist-wrapper');
var wishListMobileTab = document.querySelector('.wishlist-mobile-tab');
var commuteCostsDesktop = document.querySelector('.commute-costs-wrapper');
var commuteCostsMobileTab = document.querySelector('.commuteCosts-mobile-tab');

// Define our viewportWidth variable
var viewportWidth;
// Set/update the viewportWidth value
var setViewportWidth = function () {
	viewportWidth = window.innerWidth || document.documentElement.clientWidth;
}

// Log the viewport width into the console
var logWidth = function () {
	if (viewportWidth < 991) {
		while (desktopCommutesCol.childNodes.length > 0) {
            mobileCommutesTab.appendChild(desktopCommutesCol.childNodes[0]);
        }
        while (wishListDesktop.childNodes.length > 0) {
            wishListMobileTab.appendChild(wishListDesktop.childNodes[0]);
        }
        while (commuteCostsDesktop.childNodes.length > 0) {
            commuteCostsMobileTab.appendChild(commuteCostsDesktop.childNodes[0]);
        }
	} else {
        while (mobileCommutesTab.childNodes.length > 0) {
            desktopCommutesCol.appendChild(mobileCommutesTab.childNodes[0]);
        }
        while (wishListMobileTab.childNodes.length > 0) {
            wishListDesktop.appendChild(wishListMobileTab.childNodes[0]);
        }
        while (commuteCostsMobileTab.childNodes.length > 0) {
            commuteCostsDesktop.appendChild(commuteCostsMobileTab.childNodes[0]);
        }
	}
}

// Set our initial width and log it
setViewportWidth();
logWidth();

// On resize events, recalculate and log
window.addEventListener('resize', function () {
	setViewportWidth();
	logWidth();
}, false);


//////////hiding and showing content for tabs on

const tabs = document.querySelectorAll('.main-mobile-tab');
var mobileCommutesTab = document.querySelector('.commutes-mobile-tab');
var wishListMobileTab = document.querySelector('.wishlist-mobile-tab');
var commuteCostsMobileTab = document.querySelector('.commuteCosts-mobile-tab');


console.log(tabs);

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
                    console.log(commuteCostsMobileTab);
                    commuteCostsMobileTab.classList.add('active-tab');
                    wishListMobileTab.classList.remove('active-tab');
                    mobileCommutesTab.classList.remove('active-tab');
                    break;
                case "Commutes":
                    console.log(mobileCommutesTab);
                    mobileCommutesTab.classList.add('active-tab');
                    commuteCostsMobileTab.classList.remove('active-tab');
                    wishListMobileTab.classList.remove('active-tab');
                    break;
                default:
                    console.log(wishListMobileTab);
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
    console.log(itemValue);
    let requiredCommutesField = card.querySelector('.commutes-required');
    const commutesRequired = parseInt(itemValue / averageOfLastFiveCommutes);
    
    requiredCommutesField.innerText = commutesRequired;
    console.log(commutesRequired);
});

console.log(wishListCards);