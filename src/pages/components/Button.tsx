import {Component} from "react";
import {useRouter} from "next/router";

interface ButtonProps {
    text: string;
    icon: string;
    href: string;
}

export default class Button extends Component<ButtonProps, {}> {
    render() {
        return (
            <div
                className="shadow-xl flex justify-center items-center transition duration-500 ease-in-out"
                style={{
                    height: "42px",
                    borderRadius: "8px",
                    backgroundColor: "#24282f"
                }}
                onClick={() => useRouter().push(this.props.href)}>
                <a className="flex flex-row justify-center items-center"
                   style={{padding: "20px"}}>
                    <img alt="github login" src={this.props.icon} style={{height: "32px", width: "32px"}}/>
                    <p className={`text-white text-sm`}>{this.props.text}</p>
                </a>
            </div>
        );
    }
}