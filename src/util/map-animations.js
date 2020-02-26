/*
* Copyright 2020 Gemeente Heerenveen
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
import _ from 'lodash';
const defaultDuration = 600;
const minZoom = 1;
const maxZoom = 20;

export function flyTo(view, location, onComplete = _.noop) {
    const zoom = view.getZoom();
    var duration = defaultDuration * 2;
    view.animate({
        center: location,
        duration: duration
    });
    animate({
        view: view,
        animations: [
            {
                duration: duration / 2,
                zoom: Math.max(zoom - 1, minZoom)
            },
            {
                duration: duration / 2,
                zoom: view.getMaxZoom() - 1
            }
        ]
    }, onComplete);
}

export function zoomTo(view, location, onComplete = _.noop) {
    const zoom = view.getZoom();
    const duration = defaultDuration;
    animate({
        view: view,
        animations: [
            {
                center: location,
                duration: duration,
                zoom: Math.min(zoom + 2, maxZoom)
            }
        ]
    }, onComplete);
}

export function zoomToMax(view, location, onComplete = _.noop) {
    const zoom = view.getZoom();
    const duration = defaultDuration;
    animate({
        view: view,
        animations: [
            {
                center: location,
                duration: duration,
                zoom: view.getMaxZoom() - 1
            }
        ]
    }, onComplete);
}

export function moveTo(view, location, onComplete = _.noop) {
    const duration = defaultDuration;
    animate({
        view: view,
        animations: [
            {
                center: location,
                duration: duration
            }
        ]
    }, onComplete);
}

// BUG: Na het inzoomen verdwijnt de kaart zodra je de kaart verplaatst
export function moveToAndZoom(view, location, onComplete = _.noop) {
    const duration = defaultDuration;
    animate({
        view: view,
        animations: [
            {
                center: location,
                duration: duration
            },
            {
                center: location,
                duration: duration,
                zoom: view.getMaxZoom() - 1
            }
        ]
    }, onComplete);
}

function animate(settings, onComplete = _.noop) {
    let parts = settings.animations.length;
    let called = false;
    const callback = (complete) => {
        --parts;
        if(called) {
            return;
        }
        if(parts == 0 || !complete) {
            called = true;
            onComplete();
        }
    };
    settings.view.animate(...settings.animations, callback);
}