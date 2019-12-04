import React, {Component} from 'react';
import {Animated} from 'react-animated-css';
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
        this.state = {
            displayModal: false
        };
    }

    closeModal() {
        this.props.resetFeature();
    }

    render() {
        if(this.props.feature === null) {
            return null;
        }
        const feature = this.props.feature;
        let content;
        if(feature.id) {
            content = <DIMFeatureComponent feature={feature} />
        }
        else if(feature.name && feature.description) {
            content = <KMLFeatureComponent feature={feature} />
        }
        return (
            <Animated animationInDuration={400}>
                <div className="gh-dim-feature-modal" onClick={(e) => this.closeModal()}>
                    {content}
                    <span className="close" aria-label="Sluiten" onClick={(e) => this.closeModal()}>&times;</span>
                </div>
            </Animated>
        )
    }
}

FeatureComponent.defaultProps = {
    isFetching: 0,
    feature: null,
    resetFeature: _.noop
};