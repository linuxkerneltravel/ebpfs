import {Component} from "react";
import Input from "@/pages/components/Input";


interface SearchbarProps {
    placeholder: string;
    height: string;
    width: string;
    indent?: string;
}

export default class Searchbar extends Component<SearchbarProps, {}> {
    render() {
        return (
            <div className="flex justify-center items-center">
                <Input
                    onChange={(value) => {
                    }}
                    onEnterPress={(value) => {
                        window.location.href = '/search?query=' + value;
                    }}
                    placeholder={this.props.placeholder}
                    height={this.props.height}
                    width={this.props.width}
                    indent={this.props.indent}
                />
            </div>
        );
    }
}