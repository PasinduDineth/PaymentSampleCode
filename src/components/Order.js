import React, { Component } from 'react';
import Product from '../images/product.png';

/**
 * Need to convert this to a functional component
 */
export default class order extends Component{
    render(){
        return (
            <div className="col-lg-5">
                <div className="order">
                    <div className="order__item">
                        <div className="order__item__title">
                            <h3>Sofa</h3>
                        </div>
                        <div className="order__item__image">
                            <img src={Product} alt=""/>
                        </div>
                        <div className="order__item__price">
                            <h5>500 $</h5>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}