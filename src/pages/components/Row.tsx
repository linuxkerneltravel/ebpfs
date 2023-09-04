import {Component} from "react";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";

interface RowProps extends WithRouterProps {
    title: string;
    text: string;
    author: string[];
    tags: string[];
    url: string;
}

class Row extends Component<RowProps> {
    constructor(props: RowProps, public text: string) {
        super(props);
        this.text = this.props.text && (this.props.text.indexOf("summary:") === -1 || this.props.text.slice(this.props.text.indexOf("summary:")).indexOf("---") === -1)
            ? this.props.text
            : this.props.text && this.props.text.substring(
                this.props.text.indexOf("summary") + 9,
                this.props.text.indexOf("summary") + this.props.text.slice(this.props.text.indexOf("summary:")).indexOf("---")
            );
    }

    render() {
        return (
            <div className="shadow-xl flex justify-center flex-col gap-4 p-6"
                 style={{
                     maxWidth: "680px",
                     minHeight: "180px",
                     borderRadius: "8px",
                     textOverflow: "ellipsis",
                     overflow: "hidden",
                     whiteSpace: "pre-wrap"
                 }}
                 onClick={e => this.props.router.push(this.props.url)}>
                <p className="text-gray-900 text-lg font-bold">{this.props.title}</p>
                <p className="text-gray-600 text-sm">{
                    // 正则版本：/^summary[\s\S]*?---([\s\S]*)$/.exec(this.props.text)?.[1] || this.props.text
                    this.text
                }</p>
                <div className="flex flex-row">
                    <div className="flex flex-row flex-wrap gap-2">
                        {
                            this.props.tags && this.props.tags.map && this.props.tags.map((value, index) => {
                                return (
                                    <div key={index} className="bg-gray-200 rounded-full px-2 py-1 text-gray-600 text-sm">
                                        {
                                            value.replace('[', '')
                                                .replace(']', '')
                                                .replace('{', '')
                                                .replace('}', '')
                                                .replace(/"/g, '')
                                                .replace(/,/g, ' ')
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex flex-row justify-end">
                        {
                            this.props.author && this.props.author.map && this.props.author.map((value, index) => {
                                return (
                                    <div key={index} className="bg-green-200 rounded-full px-2 py-1 text-gray-600 text-sm">
                                        {
                                            value.replace('[', '')
                                                .replace(']', '')
                                                .replace('{', '')
                                                .replace('}', '')
                                                .replace(/"/g, '')
                                                .replace(/,/g, ' ')
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default withRouter(Row);