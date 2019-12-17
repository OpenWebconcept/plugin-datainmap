import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import _ from 'lodash';

function CloseModal({ onClick }) {
    return (
        <div className="gh-dim-modal-close">
            <span className="gh-dim-modal-close-marker" aria-label="Sluiten" onClick={(e) => onClick()}></span>
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
                    <h1>{feature.name}</h1>
                    <CloseModal onClick={() => this.props.closeModal()} />
                </header>
                <section className="gh-dim-feature-content" dangerouslySetInnerHTML={{__html: feature.description}} />
            </>
        )
    }
}

// 
class DIMFeatureComponent extends Component {
    render() {
        const feature = this.props.feature;
        return (
            <>
                <header>
                    <h1>Informatie</h1>
                    <CloseModal onClick={() => this.props.closeModal()} />
                </header>
                <section className="gh-dim-feature-content" dangerouslySetInnerHTML={{__html: feature.content}} />
            </>
        );
    }
}

export default class FeatureComponent extends Component {
    constructor(props) {
        super(props);
    }

    closeModal() {
        this.props.resetFeature();
    }

    componentDidUpdate(prevProps) {
        if(this.props.feature !== null) {
            document.body.classList.add('gh-dim-modal-open');
        }
        else {
            document.body.classList.remove('gh-dim-modal-open');
        }
    }

    render() {
        let content;
        if(this.props.feature !== null) {
            const feature = this.props.feature;
            if(feature.id) {
                content = <DIMFeatureComponent feature={feature} closeModal={() => this.closeModal()} />
            }
            else if(feature.name) {
                content = <KMLFeatureComponent feature={feature} closeModal={() => this.closeModal()} />
            }
        }
        return (
            <CSSTransition
                in={this.props.feature !== null}
                timeout={400}
                unmountOnExit
                classNames="transition">
                <div className="gh-dim-feature-modal" onClick={(e) => this.closeModal()}>
                    // Voorkom dat een click op het article-element het modal sluit
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
    resetFeature: _.noop
};