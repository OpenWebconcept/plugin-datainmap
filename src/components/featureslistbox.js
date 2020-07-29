import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class FeaturesListboxComponent extends Component {

    render() {
        return (
            <div className="gh-dim-features-listbox">
                <ul>
                    {this.props.visibleFeatures.slice(0, this.props.maxResults).map((feature, i) => {
                        return <li key={i}>{feature.get('title')}</li>
                    })}
                </ul>
            </div>
        )
    }
}

FeaturesListboxComponent.defaultProps = {
    visibleFeatures: [],
    maxResults: 100
};

export default FeaturesListboxComponent;