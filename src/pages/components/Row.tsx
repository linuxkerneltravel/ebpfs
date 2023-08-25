import {Component, useState} from "react";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";

interface RowProps extends WithRouterProps {
    title: string;
    text: string;
    tags: string[];
    url: string;
}

class Row extends Component<RowProps> {
    constructor(props: RowProps) {
        super(props);
    }

    render() {
        return (
            <div className="shadow-xl flex justify-center flex-col gap-4 p-6"
                 style={{
                     maxWidth: "680px",
                     height: "240px",
                     borderRadius: "8px",
                     textOverflow: "ellipsis",
                     overflow: "hidden",
                     whiteSpace: "pre-wrap"
                 }}
                 onClick={e => this.props.router.push(this.props.url)}>
                <p className="text-gray-900 text-lg font-bold">{this.props.title}</p>
                <p className="text-gray-600 text-sm">{this.props.text}</p>
                <div className="flex flex-row flex-wrap gap-2">
                    {
                        this.props.tags && this.props.tags.map((value, index) => {
                            return (
                                <div key={index} className="bg-gray-200 rounded-full px-2 py-1 text-gray-600 text-sm">
                                    {value}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Row);