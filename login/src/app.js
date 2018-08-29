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
}

commuteExpand.forEach(commute => commute.addEventListener('click', expandCommute));

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

