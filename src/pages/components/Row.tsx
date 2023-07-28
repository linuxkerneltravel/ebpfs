import {Component} from "react";

interface RowProps {
    title: string;
    text: string;
    url: string;
}

export default class Row extends Component<RowProps, {}> {
    render() {
        return (
            <div className="shadow-xl flex justify-center flex-col gap-4 p-4"
                 style={{
                     maxWidth: "680px",
                     height: "180px",
                     borderRadius: "8px",
                 }}
                 onClick={e => window.location.href = this.props.url}>
                <p className="text-gray-900 text-lg font-bold">{this.props.title}</p>
                <p className="text-gray-600 text-sm">{this.props.text}</p>
            </div>
        );
    }
}