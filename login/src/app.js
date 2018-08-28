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

import {MDCTabBar} from '@material/tab-bar';

const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

import {MDCChipSet} from '@material/chips';

const chipSet = new MDCChipSet(document.querySelector('.mdc-chip'));


//Expand and collapse the commute boxes

const commuteExpand = document.querySelectorAll('.expand-commute');

function expandCommute(e) {
    const expandButton = e.currentTarget;
    const visibleArea = expandButton.parentElement;
    const expandableArea = visibleArea.nextElementSibling;
    expandableArea.classList.toggle('expanded');
}
console.log('yo');
commuteExpand.forEach(commute => commute.addEventListener('click', expandCommute));