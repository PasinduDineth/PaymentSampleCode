import React, { Component } from 'react';

/**
 * Need to convert this to a functional component
 */
class Loading extends Component {
    render() {
        return (
            <div className="loading col-lg-7">
                <div className="loading__container">
                    <div className="wrap">
                        <div className="bounceball"></div>
                        <div className="text">Processing</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Loading;