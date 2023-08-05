import {Component} from "react";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";

interface ButtonProps extends WithRouterProps {
    text: string;
    icon?: string;
    href?: string;
    onclick?: () => void;
}

class Button extends Component<ButtonProps> {
    render() {
        return (
            <div
                className="shadow-xl flex justify-center items-center transition duration-500 ease-in-out"
                style={{
                    height: "42px",
                    borderRadius: "8px",
                    backgroundColor: "#24282f"
                }}
                onClick={() => {
                    this.props.onclick && this.props.onclick();
                    this.props.href && this.props.router.push(this.props.href);
                }}>
                <a className="flex flex-row justify-center items-center"
                   style={{padding: "20px"}}>
                    {
                        this.props.icon &&
                        <img alt="github login" src={this.props.icon} style={{height: "32px", width: "32px"}}/>
                    }
                    <p className={`text-white text-sm`}>{this.props.text}</p>
                </a>
            </div>
        );
    }
}

export default withRouter(Button);