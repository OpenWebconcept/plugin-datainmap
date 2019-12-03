import _ from 'lodash';
const defaultDuration = 600;

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
                zoom: zoom - 1
            },
            {
                duration: duration / 2,
                zoom: zoom + 2
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
                zoom: zoom + 2
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

export function moveToAndZoom(view, location, onComplete = _.noop) {
    const zoom = view.getZoom();
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
                zoom: zoom + 2
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