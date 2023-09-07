import {Component} from "react";

interface CardProps {
    project: string;
    org: string;
}

export default class Card extends Component<CardProps, {}> {
    render() {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row shadow-lg items-center gap-4 p-4"
                     style={{height: "108px", width: "250px"}}>
                    <img src="favicon.ico" alt="" style={{height: "42px"}} width="42"/>
                    <div className="flex flex-col justify-center">
                        <p className="text-lg text-gray-900">{this.props.project}</p>
                        <p className="text-sm text-gray-600">{`${this.props.org} / ${this.props.project}`}</p>
                    </div>
                </div>
            </div>
        );
    }
}