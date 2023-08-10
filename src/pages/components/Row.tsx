import {Component} from "react";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";

interface RowProps extends WithRouterProps {
    title: string;
    text: string;
    url: string;
}

class Row extends Component<RowProps> {
    static handleTextOverflow(text: string, max: number): string {
        if (text.replace(/\n/g, "").length > max) {
            return text.replace(/\n/g, "").substring(0, max) + "...";
        } else {
            return text.replace(/\n/g, "");
        }
    }

    render() {
        return (
            <div className="shadow-xl flex justify-center flex-col gap-4 p-4"
                 style={{
                     maxWidth: "680px",
                     height: "180px",
                     borderRadius: "8px",
                     textOverflow: "ellipsis",
                     overflow: "hidden",
                     whiteSpace: "pre-wrap"
                 }}
                 onClick={e => this.props.router.push(this.props.url)}>
                <p className="text-gray-900 text-lg font-bold">{this.props.title}</p>
                <p className="text-gray-600 text-sm">{Row.handleTextOverflow(this.props.text, 500)}</p>
            </div>
        );
    }
}

export default withRouter(Row);