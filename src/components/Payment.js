import React, { Component } from 'react';
import _ from 'underscore';
import { Consumer } from "../context/LoadingContext";

/**
 * Need to convert this to a functional component
 */
class Payment extends Component{
    constructor(props){
        super(props);
        this.state = {
            cardNumber: '',
            cvc: '',
            name: '',
            invalid: false,
            dirty: false,
            month: '',
            year: '',
            errors: {
                type: false,
                cardNumber: false,
                cvc: false,
                month: false,
                year: false,
            },
            currentCardData: false
        };
    }

    /**
     * Card number changed
     * @param event
     */
    cardNumberChanged=(event)=>{
        let { value } = event.target;
        if (event.target.validity.valid) this.setState({cardNumber: value},this.setCardData);
        else if (value === '' || value === '-') this.setState({cardNumber: ''},this.setCardData);
    }


    /**
     * Card holder name changed
     * @param event
     */
    nameChanged=(event)=>{
        let { value } = event.target;
        if (event.target.validity.valid) this.setState({name: value},()=>{
            if(this.state.dirty){
                this.validateCard();
            }
        });
    }

    /**
     * CVC changed
     * @param event
     */
    cvcChanged=(event)=>{
        let { value } = event.target;
        if (event.target.validity.valid) this.setState({cvc: value},()=>{
            if(this.state.dirty){
                this.validateCard();
            }
        });
    }

    /**
     * Month changed
     */
    cardMonthChanged=(event)=>{
        let { value } = event.target;
        if (event.target.validity.valid) this.setState({month: value},()=>{
            if(this.state.dirty){
                this.validateCard();
            }
        });
    }

    /**
     * Year changed
     */
    cardYearChanged=(event)=>{
        let { value } = event.target;
        if (event.target.validity.valid) this.setState({year: value},()=>{
            if(this.state.dirty){
                this.validateCard();
            }
        });
    }

    /**
     * Get card data
     * @returns {*}
     */
    setCardData=()=>{
        let { cardNumber:number } = this.state;
        let pattern = '';
        let currentCardData = false;

        // AMEX Card
        pattern = new RegExp("^3[47]");
        if (number.match(pattern) != null)
            currentCardData = {
                type: "AMEX",
                numberLengths: [15]
            };

        // Visa
        pattern = new RegExp("^4");
        if (number.match(pattern) != null)
            currentCardData = {
                type: "Visa",
                numberLengths: [16, 18, 19]
            };

        // Mastercard
        pattern = new RegExp("^5[1-5]");
        if (number.match(pattern) != null)
            currentCardData = {
                type: "Mastercard",
                numberLengths: [16]
            };
        this.setState({
            currentCardData
        },()=>{
            if(this.state.dirty){
                this.validateCard();
            }
        });
    }

    /**
     * Validation
     */
    validateCard=()=>{
        let cardData = this.state.currentCardData;
        let { cardNumber, cvc, name, month, year } = this.state;
        let invalid = false;
        let errors = {
            type: false,
            cardNumber: false,
            cvc: false,
            month: false,
            year: false,
            name: false
        };
        if(cardData){
            let { numberLengths } = cardData;
            // check length
            if(!_.contains(numberLengths,cardNumber.length)){
                invalid = true;
                errors.cardNumber = true;
            }
        }else {
            errors.type = true;
            errors.cardNumber = true;
            invalid = true;
        }
        if(!this.validateCardCVC(cvc)){
            errors.cvc = true;
            invalid = true;
        }
        if(name === '' || !name){
            errors.name = true;
            invalid = true;
        }
        if(month === '' || !month){
            errors.month = true;
            invalid = true;
        }
        if(year === '' || !year){
            errors.year = true;
            invalid = true;
        }else {
            errors.year = !(parseInt(year) >= 2018);
            invalid = !(parseInt(year) >= 2018);
        }
        this.setState({
            invalid,
            errors
        });
        return invalid;
    }

    /**
     * Validate CVC
     * @param cvc
     * @returns {boolean}
     */
    validateCardCVC=(cvc)=>{
        if (!/^\d+$/.test(cvc)) {
            return false;
        }
        return cvc.length >= 3 && cvc.length <= 4;
    }

    /**
     * Checkout
     */
    checkout = context => () => {
        this.validateCard();
        this.setState({
            dirty: true
        },()=>{
            let {
                cardNumber,
                cvc,
                name,
                month,
                year
            } = this.state;

            if(this.state.invalid) return;

            console.log("submit", {
                cardNumber,
                cvc,
                name,
                month,
                year
            })
            context.setIsLoading(true)
        });
    }

    render(){

        /**
         * Better to separate this section to another component
         */
        let getCardLogo = (()=>{
            return this.state.currentCardData ? (()=>{
                switch (this.state.currentCardData.type) {
                    case 'Visa':
                        return (
                            <div className="payment__cardDetails__group__input__logo --visa">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.5 6c.276 0 .5.224.5.5v11c0 .276-.224.5-.5.5h-19c-.276 0-.5-.224-.5-.5v-11c0-.276.224-.5.5-.5h19zm2.5 0c0-1.104-.896-2-2-2h-20c-1.105 0-2 .896-2 2v12c0 1.104.895 2 2 2h20c1.104 0 2-.896 2-2v-12zm-13.553 3.63h1.295l-.81 4.753h-1.295l.81-4.753zm3.907 1.908c-.453-.22-.73-.367-.727-.589 0-.198.235-.409.742-.409.424-.007.73.086.97.182l.116.055.176-1.03c-.257-.096-.659-.2-1.161-.2-1.28 0-2.182.645-2.189 1.568-.007.683.644 1.064 1.135 1.291.504.233.674.381.671.59-.003.318-.403.464-.775.464-.518 0-.794-.072-1.219-.249l-.167-.076-.182 1.064c.303.133.862.248 1.443.254 1.362 0 2.246-.637 2.256-1.624.003-.541-.342-.952-1.089-1.291zm5.646 2.846h-1.202l-.158-.712-1.659-.002-.273.714h-1.36l1.924-4.355c.136-.309.368-.394.678-.394h1.001l1.049 4.749zm-1.571-1.686l-.3-1.372-.088-.41-.172.454-.516 1.328h1.076zm-9.879-3.065l-1.268 3.241-.135-.659-.454-2.184c-.079-.3-.306-.39-.588-.401h-2.089l-.016.099c.508.123.962.3 1.361.521l1.152 4.128 1.371-.002 2.039-4.743h-1.373z"/></svg>
                            </div>
                        );
                    case 'Mastercard':
                        return (
                            <div className="payment__cardDetails__group__input__logo --masterCard">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.5 6c.276 0 .5.224.5.5v11c0 .276-.224.5-.5.5h-19c-.276 0-.5-.224-.5-.5v-11c0-.276.224-.5.5-.5h19zm2.5 0c0-1.104-.896-2-2-2h-20c-1.105 0-2 .896-2 2v12c0 1.104.895 2 2 2h20c1.104 0 2-.896 2-2v-12zm-6.836 5.188c0 1.761-1.427 3.188-3.188 3.188s-3.188-1.427-3.188-3.188 1.428-3.188 3.189-3.188 3.187 1.427 3.187 3.188zm-6.73 0c0-1.087.493-2.061 1.266-2.711-.487-.302-1.061-.477-1.677-.477-1.761 0-3.188 1.427-3.188 3.188s1.427 3.188 3.188 3.188c.615 0 1.19-.175 1.677-.477-.773-.65-1.266-1.624-1.266-2.711zm-1.722 4.791v-.531c0-.2-.127-.335-.333-.336-.108-.002-.22.032-.297.151-.058-.094-.151-.151-.28-.151-.09 0-.179.027-.248.126v-.104h-.184v.846h.186v-.469c0-.147.081-.225.207-.225.122 0 .184.08.184.223v.471h.186v-.469c0-.147.085-.225.207-.225.126 0 .186.08.186.223v.471h.186zm2.752-.847h-.301v-.257h-.186v.257h-.172v.168h.172v.386c0 .197.076.313.294.313.08 0 .172-.025.23-.066l-.053-.158-.163.048c-.092 0-.122-.057-.122-.142v-.382h.301v-.167zm1.57-.021c-.106 0-.175.05-.223.124v-.103h-.182v.846h.184v-.475c0-.14.06-.218.181-.218l.115.021.057-.174-.132-.021zm-2.374.089c-.089-.058-.211-.089-.345-.089-.214 0-.352.103-.352.271 0 .138.103.223.292.25l.087.012c.101.014.149.041.149.089 0 .066-.067.103-.193.103-.127 0-.22-.041-.282-.089l-.088.143c.101.074.228.11.367.11.244 0 .386-.115.386-.276 0-.149-.112-.227-.296-.253l-.087-.012c-.08-.011-.143-.027-.143-.083 0-.062.06-.099.161-.099.108 0 .212.041.264.073l.08-.15zm4.933-.089c-.106 0-.175.05-.223.124v-.103h-.182v.846h.184v-.475c0-.14.06-.218.181-.218l.115.021.057-.174-.132-.021zm-2.373.445c0 .257.179.444.452.444.127 0 .212-.028.305-.101l-.089-.149c-.069.05-.142.076-.221.076-.147-.002-.255-.108-.255-.271 0-.163.108-.269.255-.271.08 0 .152.027.221.076l.089-.149c-.092-.073-.177-.101-.305-.101-.273.001-.452.189-.452.446zm1.725 0v-.423h-.184v.103c-.058-.076-.147-.124-.267-.124-.237 0-.423.186-.423.444 0 .259.186.444.423.444.12 0 .209-.048.267-.124v.103h.184v-.423zm-.685 0c0-.149.097-.271.257-.271.152 0 .255.117.255.271 0 .154-.103.271-.255.271-.16-.001-.257-.123-.257-.271zm-2.222-.445c-.248 0-.421.181-.421.444 0 .269.181.444.434.444.127 0 .244-.032.347-.119l-.09-.136c-.071.057-.161.089-.246.089-.119 0-.227-.055-.253-.207h.629l.004-.071c-.004-.263-.167-.444-.404-.444zm-.004.165c.119 0 .195.074.214.205h-.439c.02-.122.094-.205.225-.205zm4.62.28v-.763h-.184v.443c-.058-.076-.147-.124-.267-.124-.237 0-.423.186-.423.444 0 .259.186.444.423.444.12 0 .209-.048.267-.124v.103h.184v-.423zm-.685 0c0-.149.097-.271.257-.271.152 0 .255.117.255.271 0 .154-.103.271-.255.271-.16-.001-.257-.123-.257-.271zm-6.219 0v-.423h-.185v.103c-.058-.076-.147-.124-.267-.124-.237 0-.423.186-.423.444s.186.444.423.444c.12 0 .209-.048.267-.124v.103h.185v-.423zm-.686 0c0-.149.097-.271.257-.271.152 0 .255.117.255.271 0 .154-.103.271-.255.271-.159-.001-.257-.123-.257-.271z"/></svg>
                            </div>
                        );
                    case 'AMEX':
                        return (
                            <div className="payment__cardDetails__group__input__logo --amex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.5 6c.276 0 .5.224.5.5v11c0 .276-.224.5-.5.5h-19c-.276 0-.5-.224-.5-.5v-11c0-.276.224-.5.5-.5h19zm2.5 0c0-1.104-.896-2-2-2h-20c-1.105 0-2 .896-2 2v12c0 1.104.895 2 2 2h20c1.104 0 2-.896 2-2v-12zm-4 3.938h-2.502l-.585.63-.546-.63h-5.383l-.463 1.064-.474-1.064h-4.241l-1.806 4.124h2.162l.267-.658h.613l.267.658h8.984l.602-.641.563.641h2.542l-1.811-2.051 1.811-2.073zm-12.11.467v.018l-.009-.018h.009zm4.665 3.077h-.697l-.006-2.318-1.02 2.318h-.624l-1.025-2.318v2.318h-1.438l-.273-.663h-1.471l-.273.663h-.769l1.265-2.959h1.053l1.198 2.798v-2.798h1.154l.925 2.006.853-2.006h1.148v2.959zm6.119 0h-.908l-.869-.981-.903.981h-2.798v-2.959h2.842l.869.97.897-.97h.869l-1.321 1.488 1.322 1.471zm-3.004-2.346l.774.864-.808.869h-1.739v-.591h1.549v-.602h-1.549v-.541h1.773zm-8.934-.111l.485 1.181h-.97l.485-1.181z"/></svg>
                            </div>
                        );
                }
            })() : (
                <div className="payment__cardDetails__group__input__logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 4h-20c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm0 13.5c0 .276-.224.5-.5.5h-19c-.276 0-.5-.224-.5-.5v-6.5h20v6.5zm0-9.5h-20v-1.5c0-.276.224-.5.5-.5h19c.276 0 .5.224.5.5v1.5zm-9 6h-9v-1h9v1zm-3 2h-6v-1h6v1zm10-2h-3v-1h3v1z"/></svg>
                </div>
            );
        })();

        return(
            <Consumer>
                {context => (
                    <div className="payment col-lg-7">
                        <div className="row">
                            <div className="col-sm payment__cardDetailsHolder">
                                <div className="payment__cardDetails">
                                    <h5>Payment Details</h5>
                                    <div className="form-group payment__cardDetails__group">
                                        <label>Card Number</label>
                                        <div className={  `payment__cardDetails__group__input ${(this.state.errors.cardNumber ? '--error' : '')}` }>
                                            { getCardLogo }
                                            <input value={this.state.cardNumber} className="form-control" type="text" onChange={this.cardNumberChanged} pattern="^-?[0-9]\d*\.?\d*$"/>
                                        </div>
                                    </div>
                                    <div className="form-group payment__cardDetails__groupSet">
                                        <div className="form-group payment__cardDetails__group">
                                            <label>Expiry Date</label>
                                            <div className="payment__cardDetails__group__inputSet">
                                                <div className={  `payment__cardDetails__group__input ${(this.state.errors.month ? '--error' : '')}` }>
                                                    <input placeholder="Month" value={this.state.month} className="form-control" type="text" onChange={this.cardMonthChanged} pattern="^(0?[1-9]|1[012])$"/>
                                                </div>
                                                <div className={  `payment__cardDetails__group__input ${(this.state.errors.year ? '--error' : '')}` }>
                                                    <input placeholder="Year" value={this.state.year} className="form-control" type="text" onChange={this.cardYearChanged} pattern="^-?[0-9]\d*\.?\d*$"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group payment__cardDetails__group">
                                            <label>CVC</label>
                                            <div className={  `payment__cardDetails__group__input ${(this.state.errors.cvc ? '--error' : '')}` }>
                                                <input value={this.state.cvc} className="form-control" type="text" pattern="^-?[0-9]\d*\.?\d*$" onChange={this.cvcChanged}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group payment__cardDetails__group">
                                        <label>Card Holder</label>
                                        <div className={  `payment__cardDetails__group__input ${(this.state.errors.name ? '--error' : '')}` }>
                                            <input value={this.state.name} className="form-control" type="text" onChange={this.nameChanged}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="payment__actions">
                                    <a className='btn' onClick={this.checkout(context)}>Checkout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Consumer>
        )
    }
}

Payment.contextType = Consumer;
export default Payment;