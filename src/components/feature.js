import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import _ from 'lodash';

// Basic KML rendering
class KMLFeatureComponent extends Component {
    render() {
        if(this.props.feature === null) {
            return null;
        }
        const feature = this.props.feature;
        return (
            <article>
                <header>
                    <h1>{feature.name}</h1>
                </header>
                <section dangerouslySetInnerHTML={{__html: feature.description}} />
            </article>
        )
    }
}

// 
class DIMFeatureComponent extends Component {
    render() {
        const feature = this.props.feature;
        let featuredImage = null;
        if(feature.featuredImage) {
            console.log(feature);
            const image = feature.featuredImage.thumbnail;
            featuredImage = <img src={image[0]} width={image[1]} height={image[2]} />
        }
        return (
            // Voorkom dat een click op het article-element het modal sluit
            <article onClick={e => e.stopPropagation() }>
                <header>
                    <h1>{feature.title}</h1>
                    {featuredImage}
                </header>
                <section dangerouslySetInnerHTML={{__html: feature.content}} />
                <section>
                    <FeatureComponentPhotos images={feature.images} />
                </section>
            </article>
        );
    }
}

class FeatureComponentPhotos extends Component {
    render() {
        if(this.props.images.length == 0) {
            return null;
        }
        return (
            <ul>
                {this.props.images.map( (imageset, i) => {
                    return (
                        <li key={i}><img src={imageset.medium[0]} /></li>
                    );
                })}
            </ul>
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

    render() {
        let content;
        if(this.props.feature !== null) {
            const feature = this.props.feature;
            if(feature.id) {
                content = <DIMFeatureComponent feature={feature} />
            }
            else if(feature.name) {
                content = <KMLFeatureComponent feature={feature} />
            }
        }
        return (
            <CSSTransition
                in={this.props.feature !== null}
                timeout={400}
                unmountOnExit
                classNames="transition">
                <div className="gh-dim-feature-modal" onClick={(e) => this.closeModal()}>
                    {content}
                    <span className="close" aria-label="Sluiten" onClick={(e) => this.closeModal()}>&times;</span>
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