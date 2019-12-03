import React, {Component} from 'react';
import _ from 'lodash';

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
    render() {
        if(this.props.feature === null) {
            return null;
        }
        const feature = this.props.feature;
        let featuredImage = null;
        if(feature.featuredImage) {
            const image = feature.featuredImage.thumbnail;
            featuredImage = <img src={image[0]} width={image[1]} height={image[2]} />
        }
        return (
            <article>
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

FeatureComponent.defaultProps = {
    isFetching: 0,
    feature: null
};