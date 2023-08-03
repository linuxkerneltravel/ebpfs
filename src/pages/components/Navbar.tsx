import {Component} from "react";
import Avatar from "@/pages/components/Avatar";
import Searchbar from "@/pages/components/Searchbar";

interface NavbarProps {
    src?: string;
    alt?: string;
}

export default class Navbar extends Component<NavbarProps, {}> {
    render() {
        return (
            <div className="glass fixed z-50 w-full shadow-lg flex items-center"
                 style={{height: "60px", backgroundColor: "rgba(255,255,255,0.8)"}}>
                <div className="w-full flex flex-row-reverse">
                    <div className="flex gap-4 mr-2">
                        <Searchbar placeholder="搜索 eBPF 程序" height="36px" width="280px"/>
                        <Avatar src={this.props.src} alt={this.props.alt}/>
                    </div>
                </div>
            </div>
        );
    }
}