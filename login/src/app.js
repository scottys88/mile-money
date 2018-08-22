import _ from 'lodash';
import {MDCTemporaryDrawer, MDCTemporaryDrawerFoundation, util} from '@material/drawer';

let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
document.querySelector('.menu').addEventListener('click', () => drawer.open = true);