import {Component} from "react";
import {Index} from "@/common";

interface RowProps {
    index: Index;
    highlight: string;
}

export default class Row extends Component<RowProps, {}> {
    render() {
        const pattern = new RegExp(this.props.highlight, 'g');
        const parts = this.props.index.readme.split(pattern);

        return (
            <div className="shadow-xl flex justify-center flex-col gap-4 p-4"
                 style={{
                     maxWidth: "680px",
                     height: "180px",
                     borderRadius: "8px",
                 }}
                 onClick={e => window.location.href = this.props.index.url}>
                <p className="text-gray-900 text-lg font-bold">{this.props.index.organization}  / {this.props.index.project}</p>
                <p className="text-gray-600 text-sm">
                    {parts.map((part, index) => (
                        pattern.test(part)
                            ? <span key={index} className="font-bold">{part}</span>
                            : part
                    ))}
                </p>
            </div>
        );
    }
}