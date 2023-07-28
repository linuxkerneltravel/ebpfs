import {Component} from "react";

interface RowProps {
    title: string
    text: string;
    highlight: string;
}

export default class Row extends Component<RowProps, {}> {
    render() {
        return (
            <div className="flex justify-center items-center">

            </div>
        );
    }
}