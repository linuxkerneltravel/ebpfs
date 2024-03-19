import {Component} from "react"
import Input from "@/pages/components/Input"
import {withRouter} from "next/router"
import {WithRouterProps} from "next/dist/client/with-router"


interface SearchbarProps extends WithRouterProps {
    placeholder: string
    height: string
    width: string
    indent?: string
    textColor?: string
}

class Searchbar extends Component<SearchbarProps> {
    render() {
        return (
            <div className="flex justify-center items-center">
                <Input
                    onChange={(value) => {
                    }}
                    onEnterPress={(value) => this.props.router.push("/search?query=" + value)}
                    placeholder={this.props.placeholder}
                    height={this.props.height}
                    width={this.props.width}
                    indent={this.props.indent}
                    textColor={this.props.textColor}
                />
            </div>
        );
    }
}

export default withRouter(Searchbar)