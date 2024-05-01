/*
* Copyright 2020-2024 Gemeente Heerenveen
*
* Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
* You may not use this work except in compliance with the Licence.
* You may obtain a copy of the Licence at:
*
* https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
*
* Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the Licence for the specific language governing permissions and limitations under the Licence.
*/

/**
  * Calculate width of scrollbar
 * 
 * Source: https://stackoverflow.com/a/16771535
 * @returns {int} Width of scrollbar in pixels
 */
const _getScrollbarWidth = () => {
    let width = _getScrollbarWidth.width;
    if (width === undefined) {
        let div = document.createElement('div');
        div.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
        div = div.firstChild;
        document.body.appendChild(div);
        width = _getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
    }
    return width;
};

/**
  * Calculate width of scrollbar
 * 
 * Source: https://stackoverflow.com/a/16771535
 * @returns {int} Width of scrollbar in pixels
 */
export function getScrollbarWidth() {
    return _getScrollbarWidth();
}
