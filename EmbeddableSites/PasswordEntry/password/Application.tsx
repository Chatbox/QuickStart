import * as React from "react";

interface MyState {
    password: string,
    maskedPassword: string,
    label: string,
    mask: string,
    width: string
}

interface MyProps {
    label: string,
    mask: string,
    width: string,
    password: string
}

export default class Application extends React.Component<MyProps, MyState> {

    width;
    success = false;
    loading = false;
    callbackFunction;

    constructor(props) {
        super(props);
        var maskedPassword = '';
        for (var i = 0; i < props.password.length; i++) {
            maskedPassword += props.mask;
        }
        this.state = {
            password: props.password,
            maskedPassword: maskedPassword,
            label: props.label,
            mask: props.mask,
            width: props.width
        };
        this.width = props.width;
        this.callbackFunction = this.callback();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.callback = this.callback.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    callback = () => {
        return "//" + window.location.href.split('callback=')[1];
    };

    handleKeyUp(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("Enter pressed");
            this.submit(this.state.password);
        } else {
            //doNothing
        }
    }

    handleBlur(event) {
        this.submit(this.state.password);
    }

    handleChange(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            this.submit(this.state.password);
        } else {
            if (event.target.value.length<101) {
                event.persist();
                var value = event.target.value.charAt(event.target.value.length - 1);
                if (event.target.value.length < this.state.maskedPassword.length) {
                    this.setState(prevState => {
                        let s1 = prevState.maskedPassword.substring(0, prevState.maskedPassword.length - 1);
                        let s2 = prevState.password.substring(0, prevState.password.length - 1);
                        return {
                            password: s2,
                            maskedPassword: s1,
                            label: prevState.label,
                            mask: prevState.mask
                        }
                    })
                } else if (value == this.state.mask) {
                    this.setState(prevState => {
                        let s1 = prevState.maskedPassword.substring(0, prevState.maskedPassword.length - 1);
                        let s2 = prevState.password.substring(0, prevState.password.length - 1);
                        return {
                            password: s2,
                            maskedPassword: s1,
                            label: prevState.label,
                            mask: prevState.mask
                        }
                    })
                } else {
                    this.setState(prevState => {
                        let s1 = '';
                        let s2 = prevState.password += value;
                        for (var i = 0; i < s2.length; i++) {
                            s1 += this.state.mask;
                        }
                        return {
                            password: s2,
                            maskedPassword: s1,
                            label: prevState.label,
                            mask: prevState.mask
                        }
                    })
                }
            } else {
                console.log("Error: Greater than 100 character max.")
            }
        }
    }

    submit = (password) => {

        var data = {
            password: password
        };

        if (this.callbackFunction) {
            console.log("ajax call...");
            $.ajax({
                url: this.callbackFunction,
                headers: {"Content-type": "application/json"},
                data: JSON.stringify({value: data}),
                error: function () {
                    console.error("ERROR");
                },
                success: function (data) {
                    console.log("Success");
                    this.loading = false;
                    this.success = true;
                    console.log(data);
                },
                type: 'POST',
            });
        } else {
            console.log("No Callback?");
            setTimeout(function () {
                this.loading = false;
                this.success = true;
            }, 800);
        }
    };

    handleSubmit(event) {
        event.preventDefault();
        this.submit(this.state.password);
    }

    render() {
        const inputStyle = {
            width:this.width
        };
        return (
            <form>
                <label className="left">{this.state.label}</label>
                <span className="left2"><input type="text" value={this.state.maskedPassword}
                                               onKeyPress={this.handleKeyUp} style={inputStyle}
                                               onChange={this.handleChange} onBlur={this.handleBlur}/></span>
            </form>
        );
    }
}

/*

 */