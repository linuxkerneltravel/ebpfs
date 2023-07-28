import {Component} from "react";

interface RowProps {
    title: string;
    text: string;
    url: string;
}

export default class Row extends Component<RowProps, {}> {
    render() {
        return (
            <div className="flex justify-center items-center"
                 onClick={e => window.location.href = this.props.url}>
                <p>{this.props.title}</p>
                <p>{this.props.text}</p>
            </div>
        );
    }
}