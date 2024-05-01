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
import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import _ from 'lodash';
import { getScrollbarWidth } from '../util/browser';
import { FEATURE_TYPE_WMSFEATURE, FEATURE_TYPE_KMLFEATURE, FEATURE_TYPE_DIMFEATURE, FEATURE_TYPE_UNKNOWN } from '../constants';

function CloseModal({ onClick }) {
    const onReturn = (e) => {
        if(e.key == 'Enter') {
            onClick();
        }
    };
    return (
        <div className="gh-dim-modal-close">
            <span className="gh-dim-modal-close-marker" role="button" tabIndex="0" aria-label="Sluiten" onClick={(e) => onClick()} onKeyDown={onReturn}></span>
        </div>
    )
}

// Basic KML rendering
class KMLFeatureComponent extends Component {
    render() {
        if(this.props.feature === null) {
            return null;
        }
        const feature = this.props.feature;
        return (
            <>
                <header>
                    <h2>{feature.name}</h2>
                    <CloseModal onClick={() => this.props.closeModal()} />
                </header>
                <section className="gh-dim-feature-content" dangerouslySetInnerHTML={{__html: feature.description}} tabIndex="0" />
            </>
        )
    }
}

// Basis WMS Feature rendering
class WMSFeatureComponent extends Component {
    render() {
        if(this.props.feature === null) {
            return null;
        }
        const feature = this.props.feature;
        return (
            <>
                <header>
                    <h2>Informatie</h2>
                    <CloseModal onClick={() => this.props.closeModal()} />
                </header>
                <section className="gh-dim-feature-content" dangerouslySetInnerHTML={{__html: feature}} tabIndex="0" />
            </>
        )
    }
}

// 
class DIMFeatureComponent extends Component {
    render() {
        const feature = this.props.feature;
        let title = 'Informatie';
        if(feature.useAlternativeTitle) {
            if(feature.alternativeTitle.length > 0) {
                title = feature.alternativeTitle;
            }
            else {
                title = feature.title;
            }
        }
        return (
            <>
                <header>
                    <h2 dangerouslySetInnerHTML={{__html: title}}></h2>
                    <CloseModal onClick={() => this.props.closeModal()} />
                </header>
                <section className="gh-dim-feature-content" dangerouslySetInnerHTML={{__html: feature.content}} tabIndex="0" />
            </>
        );
    }
}

export default class FeatureComponent extends Component {
    constructor(props) {
        super(props);
        this.refModal = React.createRef();
        this.closeModalWithEscape = (e) => {
            if(e.key === 'Escape') {
                this.closeModal();
            }
        };
        this.trapFocusInsideModal = (e) => {
            // Based on https://gist.github.com/myogeshchavan97/d50d42aa9205573b811587d57c2e58a6#file-trap_focus-js
            const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            const modal = this.refModal.current;
            const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
            const focusableContent = modal.querySelectorAll(focusableElements);
            const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal
            const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
            if(!isTabPressed) {
                return;
            }

            if(e.shiftKey) { // if shift key pressed for shift + tab combination
                if(document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus(); // add focus for the last focusable element
                    e.preventDefault();
                }
            }
            else { // if tab key is pressed
                if(document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                    firstFocusableElement.focus(); // add focus for the first focusable element
                    e.preventDefault();
                }
            }
        };
    }

    closeModal() {
        this.props.resetFeature();
    }

    componentDidUpdate(prevProps) {
        if(this.props.feature !== null) {
            document.body.classList.add('gh-dim-modal-open');
            document.body.style.paddingRight = getScrollbarWidth() + 'px';
            if(typeof this.props.cb === 'function') {
                this.refModal.current.focus();
                this.props.cb(this.props.feature);
            }
        }
        else {
            document.body.classList.remove('gh-dim-modal-open');
            document.body.style.paddingRight = null;
        }

        // Close modal when Escape is pressed
        if(this.props.feature !== null) {
            document.addEventListener('keydown', this.closeModalWithEscape);
            document.addEventListener('keydown', this.trapFocusInsideModal);
        }
        else {
            document.removeEventListener('keydown', this.closeModalWithEscape);
            document.removeEventListener('keydown', this.trapFocusInsideModal);
        }
    }

    render() {
        let content;
        if(this.props.feature !== null) {
            const feature = this.props.feature.data;
            switch(this.props.feature.type) {
                case FEATURE_TYPE_DIMFEATURE:
                    content = <DIMFeatureComponent feature={feature} closeModal={() => this.closeModal()} />
                    break;
                case FEATURE_TYPE_WMSFEATURE:
                    content = <WMSFeatureComponent feature={feature} closeModal={() => this.closeModal()} />
                    break;
                case FEATURE_TYPE_KMLFEATURE:
                    content = <KMLFeatureComponent feature={feature} closeModal={() => this.closeModal()} />
                    break;
                case FEATURE_TYPE_UNKNOWN:
                default:
                    console.error('Unknown feature type', this.props.feature.type, feature);
                    return null;
            }
        }
        return (
            <CSSTransition
                in={this.props.feature !== null}
                timeout={400}
                unmountOnExit
                classNames="transition">
                <div className="gh-dim-feature-modal" onClick={(e) => this.closeModal()} ref={this.refModal} tabIndex="0">
                    { /* Prevent a click event on the article element to close the modal */ }
                    <article className="gh-dim-feature" onClick={e => e.stopPropagation() }>
                        {content}
                    </article>
                </div>
            </CSSTransition>
        )
    }
}

FeatureComponent.defaultProps = {
    isFetching: 0,
    feature: null,
    cb: _.noop,
    resetFeature: _.noop
};