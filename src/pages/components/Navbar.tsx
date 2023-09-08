import {Component} from "react";
import Avatar from "@/pages/components/Avatar";
import Searchbar from "@/pages/components/Searchbar";

interface NavbarProps {
    src?: string;
    alt?: string;
    isGlass?: boolean;
}

export default class Navbar extends Component<NavbarProps, {}> {
    render() {
        return (
            <div
                className="bg-[#22219B] z-50 w-full flex justify-center items-center"
                style={{height: "60px"}}>
                <div className="flex flex-row items-center">
                    <Searchbar placeholder="搜索 eBPF 程序" height="36px" width="380px" textColor={"#fff"}/>
                    <div style={{width: "620px"}}></div>
                    <p className="text-white mr-3 ml-3">文档</p>
                    <p className="text-white mr-3 ml-3">关于</p>
                    <Avatar src={this.props.src} alt={this.props.alt}/>
                </div>
            </div>
        );
    }
}