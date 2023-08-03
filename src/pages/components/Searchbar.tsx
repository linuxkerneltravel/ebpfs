import {Component} from "react";
import Input from "@/pages/components/Input";
import {useRouter, withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";


interface SearchbarProps extends WithRouterProps {
    placeholder: string;
    height: string;
    width: string;
    indent?: string;
}

class Searchbar extends Component<SearchbarProps> {
    render() {
        return (
            <div className="flex justify-center items-center">
                <Input
                    onChange={(value) => {
                    }}
                    onEnterPress={(value) => useRouter().push("/search?query=" + value)}
                    placeholder={this.props.placeholder}
                    height={this.props.height}
                    width={this.props.width}
                    indent={this.props.indent}
                />
            </div>
        );
    }
}

export default withRouter(Searchbar);